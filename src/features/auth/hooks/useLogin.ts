"use client";
import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginPayload } from "@/features/auth/types/auth.types";

/**
 * useLogin Hook (NextAuth)
 * Uses next-auth/react to handle the session.
 */
export function useLogin() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleLogin = async (payload: LoginPayload) => {
    setLoading(true);
    setServerError(null);

    // NextAuth automatically set the session cookies
    const result = await signIn("credentials", {
      redirect: false, // Handle redirection manually
      email: payload.email,
      password: payload.password,
      remember: payload.remember,
    });

    if (result?.error) {
      setServerError("Email atau password salah.");
      setLoading(false);
    } else {
      const session = await getSession();

      if (
        session?.user?.role === "ADMIN" &&
        session?.user?.role === "SUPERADMIN"
      ) {
        router.push("/admin/dashboard");
      } else {
        // router.push("/");
        router.push(callbackUrl);
        router.refresh(); 
      }

      router.refresh();
    }
  };

  return { loading, serverError, handleLogin };
}
