"use client";

import { PackageX, AlertCircle } from "lucide-react";
import { Category } from "@/features/categories/types/category.types";
import { CategorySkeleton } from "./CategorySkeleton";
import { useCategories } from "@/features/categories/hooks/useCategory";
import { CategoryItem } from "@/features/categories/components/listing/CategoryItem";
import CatalogTabs from "@/features/products/components/shared/CatalogTabs";

interface CategoryMenuClientProps {
  initialCategories?: Category[];
}

export function CategoryMenuClient({
  initialCategories,
}: CategoryMenuClientProps) {
  const { categories, isLoading, error } = useCategories(initialCategories);

  if (isLoading) {
    return (
      <div className="py-8">
        <CategorySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-16 h-16 text-[var(--mama-hot-pink)] mb-4" />
        <h2 className="text-font-4 font-bold text-[var(--mama-brown)] mb-2">
          Terjadi Kesalahan
        </h2>
        <p className="text-[var(--color-gray)]">{error}</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageX className="w-20 h-20 text-[var(--color-light-gray)] mb-6" />
        <h2 className="text-font-4 font-bold text-[var(--mama-brown)] mb-2">
          Belum Ada Menu
        </h2>
        <p className="text-[var(--color-gray)]">
          Kategori menu belum tersedia saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full page-spacing">
      {/* Main Content Area */}
      <main className="flex-1">
        <CatalogTabs activeTab="categories" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </main>
    </div>
  );
}
