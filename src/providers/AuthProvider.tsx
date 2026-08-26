"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * AuthProvider
 * Wraps the application with NextAuth SessionProvider.
 */
interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}