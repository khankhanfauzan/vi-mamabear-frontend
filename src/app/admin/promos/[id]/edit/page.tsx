"use client";
import React, { useEffect, useState } from "react";
import { AdminPromoForm } from "@/features/admin/promos/components/AdminPromoForm";
import { promoService } from "@/features/admin/promos/services/promoService";
import { Promo } from "@/features/admin/promos/types/promo.types";
import { Loader2 } from "lucide-react";

export default function EditPromoPage({ params }: { params: { id: string } }) {
  const [promo, setPromo] = useState<Promo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPromo() {
      try {
        const data = await promoService.getPromoById(params.id);
        setPromo(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Gagal memuat data promo");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPromo();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[var(--mama-hot-pink)]" size={32} />
      </div>
    );
  }

  if (error || !promo) {
    return (
      <div className="p-4 sm:p-6 w-full max-w-4xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-100">
          {error || "Promo tidak ditemukan"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Edit Promo
        </h1>
        <p className="text-[var(--color-gray)] mt-1">
          Ubah detail promo &quot;{promo.code}&quot; di bawah ini.
        </p>
      </div>

      <AdminPromoForm initialData={promo} isEdit={true} />
    </div>
  );
}
