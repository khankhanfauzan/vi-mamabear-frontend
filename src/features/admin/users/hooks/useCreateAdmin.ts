import { createAdminUser } from "@/features/admin/users/services/adminService";
import { CreateAdminPayload } from "@/features/admin/users/types/admin.types";
import { useState } from "react";

export function useCreateAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitAdmin = async (payload: CreateAdminPayload) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createAdminUser(payload);
      setSuccess(true);
      return true; // Return true to signal successful creation to the component
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan data admin.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    submitAdmin,
    isLoading,
    error,
    success,
    resetState,
  };
}
