import React from "react";
import { AdminPromoForm } from "@/features/admin/promos/components/AdminPromoForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Promo Baru | MamaBear Admin",
  description: "Buat kode promo atau diskon baru",
};

export default function CreatePromoPage() {
  return (
    <div className="p-4 sm:p-6 w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Tambah Promo Baru
        </h1>
        <p className="text-[var(--color-gray)] mt-1">
          Lengkapi form di bawah ini untuk membuat kode promo.
        </p>
      </div>

      <AdminPromoForm />
    </div>
  );
}
