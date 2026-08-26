import { AuthLayout } from "@/features/auth/components/AuthLayout";
import {ForgotPasswordForm} from "@/features/auth/components/ForgotPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="h-svh flex flex-col justify-between">
      <AuthLayout
        title="Reset Password"
        subtitle="Tautan pemulihan akan dikirimkan ke email Anda"
        backToHref="/login"
        backToLabel="Kembali ke Login"
        showImage={false}
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </div>
  );
}
