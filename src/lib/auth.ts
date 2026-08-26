import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { decodeJwt } from "jose";
import { API_BASE_URL } from "@/lib/config";
import { JWT } from "next-auth/jwt";

interface DecodedJWT {
  sub?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

const ACCESS_TOKEN_LIFESPAN = 14 * 60 * 1000; // 14 minutes
const REFRESH_TOKEN_LIFESPAN = 7 * 24 * 60 * 60 * 1000; // 7 days
const SHORT_SESSION_LIMIT = 8 * 60 * 60 * 1000; // 8 hours (for non-remember-me)

// TEMPORARY TESTING TIMERS
// const ACCESS_TOKEN_LIFESPAN = 10 * 1000;  // 10 seconds (Access Token expires)
// const REFRESH_TOKEN_LIFESPAN = 60 * 1000; // 60 seconds (Remember Me limit)
// const SHORT_SESSION_LIMIT = 20 * 1000;    // 20 seconds (Non-Remember Me limit)

/**
 * refreshAccessToken
 * Logic to use the Refresh Token to get a new Access Token from the backend.
 */
async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.refreshToken}`
      },
    });
    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken:
        refreshedTokens.data?.accessToken || refreshedTokens.access_token,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFESPAN,
      // Update refreshToken if the backend rotates it
      refreshToken:
        refreshedTokens.data?.refreshToken ||
        refreshedTokens.refresh_token ||
        token.refreshToken,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

/**
 * NextAuth Configuration
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.email && credentials?.password) {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
              method: "POST",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            });

            const { data, success, message } = await res.json();

            if (res.ok && success && data) {
              const { accessToken, refreshToken } = data;
              const decoded = decodeJwt(accessToken) as DecodedJWT;

              return {
                id: decoded.sub || decoded.id || "",
                name: decoded.name || "User",
                email: decoded.email,
                role: decoded.role || "USER",
                accessToken,
                refreshToken,
                remember: credentials.remember === "true",
              };
            }
            throw new Error(message || "Invalid credentials");
          }

          return null;
        } catch (error: unknown) {
          console.error("[NextAuth Authorize Error]:", error);
          const err = error as Error;
          // Pass the error message to the login page
          throw new Error(err.message || "Authentication service unavailable");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          remember: user.remember,
          accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFESPAN,
          sessionHardLimit: user.remember
            ? Date.now() + REFRESH_TOKEN_LIFESPAN
            : Date.now() + SHORT_SESSION_LIMIT,
        } as JWT;
      }

      // Check if access token is still valid
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Check if we've hit the hard session limit (enforces "Remember Me" logic)
      if (Date.now() > (token.sessionHardLimit as number)) {
        return { ...token, error: "RefreshAccessTokenError" };
      }

      // Access token has expired, try to update it
      const refreshedToken = await refreshAccessToken(token);
      return refreshedToken;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error as string;
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string | undefined;
        session.user.role = token.role as string;
        session.user.remember = token.remember as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    // Set the cookie maxAge to 7 days, but the logic inside
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};