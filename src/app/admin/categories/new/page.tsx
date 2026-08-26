import { CategoryCreateForm } from "@/features/admin/categories/components/new/CategoryCreateForm";
import React from "react";

/**
 * Admin Category Create Page (Server Component)
 * Wraps the client-side form component within the global layout constraints.
 */
export default function AdminCategoryCreatePage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
            Kategori
          </h1>
          <p className="text-font-2 text-[var(--color-gray)] mt-1">
            Atur produk Anda dengan kategori
          </p>
        </div>
      </div>
      <CategoryCreateForm/>
    </div>
  );
}
