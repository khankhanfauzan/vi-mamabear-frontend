import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormValues } from "@/features/admin/products/types/product.types";

interface PricingInventoryProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

/**
 * ProductPricingInventorySection
 * Form section handling pricing variables, stock allocations, and physical shipping weight.
 */
export default function ProductPricingInventorySection({
  register,
  errors,
}: PricingInventoryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-4">
        Harga, Stok & Berat
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Harga
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">Rp</span>
            <input
              {...register("price", {
                required: "Harga wajib diisi",
                min: { value: 1, message: "Harga harus lebih dari 0" },
              })}
              type="number"
              min="0"
              placeholder="0"
              className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:border-[var(--mama-hot-pink)]"
            />
          </div>
          {errors.price && (
            <span className="text-red-500 text-sm">
              {errors.price.message as string}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Stok
          </label>
          <input
            {...register("stock")}
            type="number"
            min="0"
            placeholder="0"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-font-2 font-semibold text-gray-700">
            Berat (Gram)
          </label>
          <input
            {...register("weightG", {
              required: "Berat wajib diisi",
              min: { value: 1, message: "Berat harus lebih dari 0" },
            })}
            type="number"
            min="0"
            placeholder="0"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-[var(--mama-hot-pink)]"
          />
          {errors.weightG && (
            <span className="text-red-500 text-sm">
              {errors.weightG.message as string}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
