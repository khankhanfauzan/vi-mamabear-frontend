import React from "react";
import { CategoryListingClient } from "@/features/admin/categories/components/listing/CategoryListingClient";
import { Plus } from "lucide-react";
import Link from "next/link";
import { adminCategoryService } from "@/features/admin/categories/services/adminCategoryService";

export const dynamic = "force-dynamic";

/**
 * Admin Categories Page (Server Component)
 * Fetches the initial category list and renders the interactive CategoryList component.
 */
export default async function AdminCategoriesPage() {
  // Fetch data on the server using our predefined service
  const categories = await adminCategoryService.fetchCategories();

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
            Kategori
          </h1>
          <p className="text-font-2 text-[var(--color-gray)] mt-1">
            Atur produk Anda dengan kategori
          </p>
        </div>
        <Link href="/admin/categories/new">
          <button className="flex items-center gap-2 bg-[var(--mama-hot-pink)] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-font-2 font-semibold">
            <Plus size={18} />
            Tambah Kategori
          </button>
        </Link>
      </div>

      <CategoryListingClient initialCategories={categories} />
    </>
  );
}
