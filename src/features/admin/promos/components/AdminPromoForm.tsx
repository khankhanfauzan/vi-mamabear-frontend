"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CreatePromoDto, Promo } from "../types/promo.types";
import { promoService } from "../services/promoService";

interface AdminPromoFormProps {
  initialData?: Promo;
  isEdit?: boolean;
}

export function AdminPromoForm({ initialData, isEdit = false }: AdminPromoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePromoDto>({
    code: initialData?.code || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    discountType: initialData?.discountType || "PRODUCT_PERCENTAGE",
    discountValue: initialData?.discountValue || "",
    minSpendIdr: initialData?.minSpendIdr || 0,
    maxDiscountIdr: initialData?.maxDiscountIdr || "",
    maxShippingDiscountIdr: initialData?.maxShippingDiscountIdr || "",
    usageLimit: initialData?.usageLimit || 100,
    maxUsagePerUser: initialData?.maxUsagePerUser || 1,
    isActive: initialData?.isActive ?? true,
    startedAt: initialData?.startedAt ? new Date(initialData.startedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        startedAt: new Date(`${formData.startedAt}T00:00:00`).toISOString(),
        expiresAt: new Date(`${formData.expiresAt}T23:59:59`).toISOString(),
        discountValue: Number(formData.discountValue),
        minSpendIdr: Number(formData.minSpendIdr),
        maxDiscountIdr: formData.maxDiscountIdr ? Number(formData.maxDiscountIdr) : undefined,
        maxShippingDiscountIdr: formData.maxShippingDiscountIdr ? Number(formData.maxShippingDiscountIdr) : undefined,
        usageLimit: Number(formData.usageLimit),
        maxUsagePerUser: Number(formData.maxUsagePerUser),
      };

      if (isEdit && initialData) {
        await promoService.updatePromo(String(initialData.id), payload);
        toast.success("Promo berhasil diperbarui");
      } else {
        await promoService.createPromo(payload);
        toast.success("Promo berhasil dibuat");
      }

      router.push("/admin/promos");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan promo");
      toast.error("Gagal menyimpan promo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Kode Promo *</label>
            <input
              type="text"
              name="code"
              required
              value={formData.code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent uppercase"
              placeholder="MAMABEAR10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tipe Diskon *</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent bg-white"
            >
              <option value="PRODUCT_PERCENTAGE">Diskon Persentase (%)</option>
              <option value="PRODUCT_FIXED">Potongan Harga Tetap (Rp)</option>
              <option value="FREE_SHIPPING">Gratis Ongkos Kirim</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nilai Diskon *</label>
            <input
              type="number"
              name="discountValue"
              required
              min="0"
              value={formData.discountValue}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent"
              placeholder="Contoh: 10 untuk 10% atau 15000 untuk Rp"
            />
            {formData.discountType === 'PRODUCT_PERCENTAGE' && (
              <p className="text-xs text-gray-500">Masukkan persentase diskon (1-100)</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Maksimal Diskon (Opsional)</label>
            <input
              type="number"
              name="maxDiscountIdr"
              min="0"
              value={formData.maxDiscountIdr}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent"
              placeholder="Maksimal potongan dalam Rp (Kosongkan jika tidak ada)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Maksimal Diskon Ongkir (Opsional)</label>
            <input
              type="number"
              name="maxShippingDiscountIdr"
              min="0"
              value={formData.maxShippingDiscountIdr}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent"
              placeholder="Maksimal potongan ongkir (Kosongkan jika tidak ada)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Minimal Belanja (Rp) *</label>
            <input
              type="number"
              name="minSpendIdr"
              required
              min="0"
              value={formData.minSpendIdr}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Kuota Pemakaian *</label>
            <input
              type="number"
              name="usageLimit"
              required
              min="1"
              value={formData.usageLimit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent"
              placeholder="100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Maks. Penggunaan Per User *</label>
            <input
              type="number"
              name="maxUsagePerUser"
              required
              min="1"
              value={formData.maxUsagePerUser}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent"
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Berlaku Mulai *</label>
            <input
              type="date"
              name="startedAt"
              required
              value={formData.startedAt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Berlaku Sampai *</label>
            <input
              type="date"
              name="expiresAt"
              required
              value={formData.expiresAt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Deskripsi (Opsional)</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--mama-hot-pink)] focus:border-transparent"
            placeholder="Deskripsi singkat mengenai promo ini..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-[var(--mama-hot-pink)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--mama-hot-pink)]"
          />
          <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
            Aktifkan promo ini
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-[var(--mama-hot-pink)] border border-transparent rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--mama-hot-pink)] disabled:opacity-50 min-w-[120px]"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            {isEdit ? "Simpan Perubahan" : "Buat Promo"}
          </button>
        </div>
      </form>
    </div>
  );
}
