import React from "react";
import { PromoListingClient } from "@/features/admin/promos/components/PromoListingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Promo | MamaBear Admin",
  description: "Kelola kode promo dan diskon untuk pelanggan",
};

export default function PromosPage() {
  return (
    <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
      <PromoListingClient />
    </div>
  );
}
