import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      role?: string;
      remember: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    id: string;
    role?: string;
    remember: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires: number;
    sessionHardLimit: number;
    id: string;
    role: string;
    remember: boolean;
    error?: string;
  }
}
