import { ProductFormValues } from "@/features/admin/products/types/product.types";
import React from "react";
import { UseFormRegister } from "react-hook-form";

interface AdditionalDetailsProps {
  register: UseFormRegister<ProductFormValues>;
}

/**
 * ProductAdditionalDetailsSection
 * Form section handling ingredients listing and usage guidelines.
 */
export default function ProductAdditionalDetailsSection({
  register,
}: AdditionalDetailsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-4">
        Detail Tambahan
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Bahan-bahan (Ingredients)
          </label>
          <textarea
            {...register("ingredients")}
            rows={3}
            placeholder="Masukkan daftar bahan (opsional)"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Petunjuk Penggunaan (Usage Instructions)
          </label>
          <textarea
            {...register("usageInstructions")}
            rows={3}
            placeholder="Masukkan petunjuk penggunaan (opsional)"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)]"
          />
        </div>
      </div>
    </div>
  );
}
