"use client";

import { useState } from "react";
import { RegisterPayload } from "../types/auth.types";
import { registerUser } from "@/features/auth/services/authService";

/**
 * useRegister Hook
 * Handles the registration logic and manages the success state
 * to show the "Check Email" message.
 */
export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRegister = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);

    try {
      await registerUser(payload);
      setIsSubmitted(true);
    } catch (error) {
      const err = error as Error;
      setError(err.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, isSubmitted, handleRegister };
}
