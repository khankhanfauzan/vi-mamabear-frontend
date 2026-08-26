import { adminCategoryService } from "@/features/admin/categories/services/adminCategoryService";
import ProductCreateForm from "@/features/admin/products/components/new/ProductCreateForm";
import { Category } from "@/features/categories/types/category.types";
import { Suspense } from "react";

export const metadata = {
  title: "Tambah Produk | Admin MamaBear",
  description: "Buat produk baru untuk e-commerce MamaBear",
};

export const dynamic = 'force-dynamic';

/**
 * Admin Product Create Page (Server Component)
 * Fetches required category data on the server before passing it to the client form.
 */
export default async function AdminProductCreatePage() {
  // Fetch initial categories server-side to populate the select dropdown
  let categories: Category[] = [];
  try {
    categories = await adminCategoryService.fetchCategories();
  } catch (error) {
    console.error(
      "[AdminProductCreatePage] Failed to fetch categories:",
      error,
    );
  }

  return (
    <div className="page-max-width py-8 px-4 md:px-8 min-h-screen">
      <Suspense
        fallback={
          <div className="animate-pulse w-full h-[600px] bg-gray-200 rounded-lg"></div>
        }
      >
        <ProductCreateForm categories={categories} />
      </Suspense>
    </div>
  );
}
