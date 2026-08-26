import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { ConfirmResetPasswordForm } from "@/features/auth/components/ConfirmResetPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }> | { token?: string };
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token || "";

  return (
    <div className="h-svh flex flex-col justify-between">
      <AuthLayout
        title="Reset Password"
        subtitle="Masukkan password baru Anda di bawah ini"
        backToHref="/login"
        backToLabel="Kembali ke Login"
        showImage={false}
      >
        <ConfirmResetPasswordForm token={token} />
      </AuthLayout>
    </div>
  );
}
