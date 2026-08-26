import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * NextAuth Middleware
 *
 * This runs on the Next.js Edge runtime. It intercepts requests matching the
 * patterns in the 'config' export below. It reads the encrypted session cookie
 * directly to check if the user is logged in.
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if the token has hit the RefreshAccessTokenError
    if (token?.error === "RefreshAccessTokenError") {
      const loginUrl = new URL("/login", req.url);
      const response = NextResponse.redirect(loginUrl);

      // MANUALLY WIPE THE COOKIES
      // Target both standard HTTP and secure HTTPS cookie names
      response.cookies.delete("__Secure-next-auth.session-token");
      response.cookies.delete("next-auth.csrf-token");
      response.cookies.delete("next-auth.session-token");

      return response;
    }

    // --- Role-Based Protection for Admin Routes ---
    if (path.startsWith("/admin")) {
      // Allow both ADMIN and SUPERADMIN roles to access
      if (token?.role !== "ADMIN" && token?.role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      /**
       * authorized callback
       * If this returns 'false', the user is automatically redirected to pages.signIn (/login) page.
       */
      authorized({ token }) {
        return !!token;
      },
    },
  },
);

/**
 * Configure which routes are protected by this middleware.
 * Use wildcards (:path*) to cover nested routes.
 */
export const config = {
  matcher: [
    "/dashboard/:path*", // Protects /dashboard, /dashboard/settings, etc.
    "/admin/:path*",     // Protects /admin, /admin/users, etc.
    "/account/:path*"    // Protects /account and all nested account routes
  ],
};
