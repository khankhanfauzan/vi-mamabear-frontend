import { useState } from "react";
import { useForm } from "react-hook-form";
import { requestPasswordReset } from "@/features/auth/services/authService";
import {ForgotPasswordPayload} from "@/features/auth/types/auth.types";

export function useForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordPayload>();

  const onSubmit = async (data: ForgotPasswordPayload) => {
    setLoading(true);
    setApiError(null);

    try {
      await requestPasswordReset(data.email);
      setSubmitted(true);
    } catch (error) {
      console.error("[Forgot Password Error]:", error);
      const err = error as Error;
      setApiError(
        err.message || "Koneksi ke server gagal. Silakan coba lagi nanti.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    submitted,
    setSubmitted,
    loading,
    apiError,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
