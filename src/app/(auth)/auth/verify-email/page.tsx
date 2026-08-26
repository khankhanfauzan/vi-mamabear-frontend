import VerifyEmailPage from "@/features/auth/pages/VerifyEmail";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8 text-[var(--mama-brown)]">
          Memuat...
        </div>
      }
    >
      <VerifyEmailPage />
    </Suspense>
  );
}
