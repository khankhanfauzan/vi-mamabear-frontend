import { Metadata } from "next";
import { categoryService } from "@/features/categories/services/categoryService";
import { Suspense } from "react";
import { Category } from "@/features/categories/types/category.types";
import { CategorySkeleton } from "@/features/categories/components/listing/CategorySkeleton";
import { CategoryMenuClient } from "@/features/categories/components/listing/CategoryMenuClient";
import ProductListingBanner from "@/features/products/components/listing/ProductListingBanner";

export const metadata: Metadata = {
  title: "Menu | MamaBear",
  description:
    "Jelajahi berbagai pilihan minuman dan menu terbaru dari MamaBear.",
};

export default async function MenuPage() {
  let initialCategories: Category[] = [];

  try {
    // Fetch data on the server to ensure SEO readiness and immediate rendering
    initialCategories = await categoryService.fetchCategories();
  } catch (error) {
    console.error("[MenuPage] Failed to load categories:", error);
    // Even if it fails, we pass an empty array and let the client handle error boundaries if necessary,
    // or the client component can gracefully show the empty state.
  }

  return (
    <div className="page-max-width w-full min-h-screen">
      <Suspense
        fallback={
          <div className="py-8">
            <CategorySkeleton />
          </div>
        }
      >
        <ProductListingBanner />
        <CategoryMenuClient initialCategories={initialCategories} />
      </Suspense>
    </div>
  );
}
