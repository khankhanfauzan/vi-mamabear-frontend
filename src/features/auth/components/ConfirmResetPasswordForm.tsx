"use client";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { useConfirmResetPassword } from "@/features/auth/hooks/useResetPassword";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConfirmResetPasswordFormProps {
  token: string;
}

export function ConfirmResetPasswordForm({
  token,
}: ConfirmResetPasswordFormProps) {
  const router = useRouter();

  const {
    form: {
      register,
      watch,
      formState: { errors },
    },
    submitted,
    loading,
    apiError,
    onSubmit,
  } = useConfirmResetPassword({ token });

  const passwordValue = watch("password");

  if (submitted) {
    return (
      <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-stone-800 tracking-tight">
          Password Diperbarui
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed">
          Password Anda telah berhasil diubah. Sekarang Anda dapat menggunakan
          password baru untuk masuk ke akun Anda.
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="w-full bg-primary text-white h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 mt-4"
        >
          Kembali ke Login
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {apiError && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <PasswordInput
        id="new-password"
        label="Password Baru"
        placeholder="Minimal 8 karakter"
        error={errors.password}
        {...register("password", {
          required: "Password baru wajib diisi",
          minLength: {
            value: 8,
            message: "Password minimal harus memiliki 8 karakter",
          },
        })}
      />

      <PasswordInput
        id="confirm-password"
        label="Konfirmasi Password Baru"
        placeholder="Masukkan kembali password"
        error={errors.confirmPassword}
        {...register("confirmPassword", {
          required: "Konfirmasi password wajib diisi",
          validate: (value) =>
            value === passwordValue || "Password tidak cocok",
        })}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white h-12 rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary/90"
      >
        {loading ? "Menyimpan..." : "Perbarui Password"}
      </Button>
    </form>
  );
}
