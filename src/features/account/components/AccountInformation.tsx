"use client";

import React from "react";
import { User, Mail, Loader2 } from "lucide-react";
import {useAuth} from "@/features/auth/hooks/useAuth";

export function AccountInformation() {
  const { user, isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--mama-hot-pink)]" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white p-8 text-center flex flex-col items-center justify-center h-64 shadow-sm">
        <p className="text-stone-500 font-medium">
          Sesi Anda telah berakhir. Silakan masuk kembali untuk melihat informasi akun.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 flex flex-col gap-8">
      {/* Header section */}
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-[var(--mama-brown)] mb-2">
          Informasi Akun
        </h1>
        <p className="text-stone-500 text-sm">
          Kelola informasi profil dan email Anda di sini.
        </p>
      </div>

      {/* Form/Info section */}
      <div className="flex flex-col gap-8 max-w-2xl">
        {/* Full Name Field */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-[var(--mama-brown)] text-sm">
            Nama Lengkap
          </label>
          <div className="flex items-center gap-3 py-2 border-b-2 border-stone-100 text-stone-700 pb-2">
            <User size={20} className="text-stone-400 shrink-0" />
            <span className="font-semibold">{user?.name || "-"}</span>
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-[var(--mama-brown)] text-sm">
            Alamat Email
          </label>
          <div className="flex items-center gap-3 py-2 border-b-2 border-stone-100 text-stone-700 pb-2">
            <Mail size={20} className="text-stone-400 shrink-0" />
            <span className="font-semibold">{user?.email || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}