import { confirmPasswordReset } from "@/features/auth/services/authService";
import { ResetPasswordPayload } from "@/features/auth/types/auth.types";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface UseConfirmResetPasswordProps {
  token: string;
}

export function useConfirmResetPassword({
  token,
}: UseConfirmResetPasswordProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordPayload) => {
    setLoading(true);
    setApiError(null);

    try {
      await confirmPasswordReset(token, data.password);
      setSubmitted(true);
    } catch (error: unknown) {
      console.error("[Confirm Reset Error]:", error);
      const err = error as Error;
      setApiError(
        err.message ||
          "Tautan pemulihan mungkin sudah kedaluwarsa atau tidak valid.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    submitted,
    loading,
    apiError,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
