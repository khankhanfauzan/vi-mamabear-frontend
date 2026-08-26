import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Category } from "@/features/categories/types/category.types";
import { ProductFormValues } from "@/features/admin/products/types/product.types";

interface BasicInfoProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  categories: Category[];
}

/**
 * ProductBasicInfoSection
 * Form section handling basic product fields: Name, Description, SKU, and Category selection.
 */
export default function ProductBasicInfoSection({
  register,
  errors,
  categories,
}: BasicInfoProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-4">
        Informasi Dasar
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Nama Produk
          </label>
          <input
            {...register("name", {
              required: "Nama produk wajib diisi",
            })}
            type="text"
            placeholder="Masukkan nama produk"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)]"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Deskripsi
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Masukkan deskripsi produk"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-font-2 font-semibold text-gray-700">
              SKU
            </label>
            <input
              {...register("sku")}
              type="text"
              placeholder="SKU-001"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-font-2 font-semibold text-gray-700">
              Kategori
            </label>
            <select
              {...register("categoryId", {
                required: "Pilih kategori",
              })}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)] bg-white"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="text-red-500 text-sm">
                {errors.categoryId.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
