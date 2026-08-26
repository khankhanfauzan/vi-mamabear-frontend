import {ProductFormValues} from "@/features/admin/products/types/product.types";
import React from "react";
import { UseFormRegister } from "react-hook-form";

interface SeoInfoProps {
  register: UseFormRegister<ProductFormValues>;
}

/**
 * ProductSeoSection
 * Form section handling search engine indexing meta: Meta Title and Meta Description.
 */
export default function ProductSeoSection({ register }: SeoInfoProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-4">
        Informasi SEO
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Meta Title
          </label>
          <input
            {...register("metaTitle")}
            type="text"
            placeholder="Judul yang ramah SEO"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Meta Description
          </label>
          <textarea
            {...register("metaDescription")}
            rows={3}
            placeholder="Deskripsi yang ramah SEO"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)]"
          />
        </div>
      </div>
    </div>
  );
}