"use client";

import { useSession } from "next-auth/react";

/**
 * Custom wrapper around NextAuth's useSession.
 * Automatically calculates the true logged-in state by checking for session expiration errors.
 */
export function useAuth() {
  const { data: session, status } = useSession();

  // The true logged-in state
  const isLoggedIn = status === "authenticated" && session?.error !== "RefreshAccessTokenError";

  return {
    session,
    user: session?.user,
    status,
    isLoggedIn,
    isLoading: status === "loading",
  };
}