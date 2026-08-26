"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";

/**
 * VerifyEmail Component
 * Landing page that extracts the token from URL and calls the verify service.
 */
export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { status, errorMsg } = useVerifyEmail(token);

  // Loading State
  function renderLoading() {
    return (
      <div className="space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
        <p className="text-stone-500 font-medium">
          Sedang memverifikasi akun Mama...
        </p>
      </div>
    );
  }

  // Success State
  function renderSuccess() {
    return (
      <div className="space-y-6 animate-in zoom-in-95">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--mama-brown)]">
            Verifikasi Berhasil!
          </h1>
          <p className="text-stone-500 text-sm">
            Akun Mama sudah aktif. Silakan masuk untuk mulai berbelanja.
          </p>
        </div>
        <Button
          className="w-full h-12 rounded-full font-bold"
          onClick={() => router.push("/login")}
        >
          Masuk Sekarang
        </Button>
      </div>
    );
  }

  // Error State
  function renderError() {
    return (
      <div className="space-y-6 animate-in fade-in">
        <XCircle className="w-16 h-16 text-destructive mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--mama-brown)]">
            Verifikasi Gagal
          </h1>
          <p className="text-stone-500 text-sm text-wrap break-words">{errorMsg}</p>
        </div>
        <Button
          variant="outline"
          className="w-full h-12 rounded-full border-stone-200"
          onClick={() => router.push("/register")}
        >
          Daftar Ulang
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm w-full bg-white p-8 rounded-3xl shadow-xl border border-pink-50">
        {status === "loading" && renderLoading()}
        {status === "success" && renderSuccess()}
        {status === "error" && renderError()}
      </div>
    </div>
  );
}
