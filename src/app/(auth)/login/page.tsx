import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <>
      <main>
        <AuthLayout
          title="Selamat Datang Kembali"
          subtitle="Masuk ke akun MamaBear Anda"
          backToHref="/"
          backToLabel="Kembali ke Beranda"
        >
          <Suspense>
            <LoginForm />
          </Suspense>
        </AuthLayout>
      </main>
    </>
  );
}
