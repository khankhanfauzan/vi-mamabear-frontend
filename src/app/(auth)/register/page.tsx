import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <main>
        <AuthLayout
          title="Buat Akun Baru"
          subtitle="Bergabunglah dengan jutaan mama lainnya"
          backToHref="/"
          backToLabel="Kembali ke Beranda"
        >
          <RegisterForm />
        </AuthLayout>
      </main>
    </>
  );
}
