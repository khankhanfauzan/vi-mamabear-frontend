"use client";

import { PackageX, AlertCircle } from "lucide-react";
import { Category } from "@/features/categories/types/category.types";
import {useCategoryProducts} from "@/features/categories/hooks/useCategoryProducts";
import {CategorySidebar} from "@/features/categories/components/listing/CategorySidebar";
import {ProductSkeleton} from "@/features/categories/components/cdp/ProductSkeleton";
import ProductCard from "@/features/products/components/shared/ProductCard";
import CatalogTabs from "@/features/products/components/shared/CatalogTabs";

interface CategoryDetailClientProps {
  activeCategory: Category;
  allCategories: Category[]; // To power the sidebar
}

export function CategoryDetailClient({ activeCategory, allCategories }: CategoryDetailClientProps) {
  // Fetch products associated with the active category slug
  const { 
    products, 
    isLoading, 
    isFetchingNext, 
    error, 
    hasNextPage, 
    loadMore 
  } = useCategoryProducts(activeCategory.slug);

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full page-spacing">
      {/* Left Sidebar Navigation */}
      <CategorySidebar categories={allCategories} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-8">
        <CatalogTabs activeTab="categories" />
        
        {/* Header & Utilities */}
        <div className="mb-8">
          <h1 className="text-font-5 md:text-font-6 font-bold text-[var(--mama-brown)] mb-6">
            {activeCategory.name}
          </h1>
        </div>

        {/* State Handling: Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={`skel-${i}`} />
            ))}
          </div>
        )}

        {/* State Handling: Error */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--mama-cream)]/20 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-[var(--mama-hot-pink)] mb-4" />
            <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-2">Gagal Memuat Produk</h2>
            <p className="text-font-2 text-[var(--color-gray)]">{error}</p>
          </div>
        )}

        {/* State Handling: Empty */}
        {!isLoading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[var(--mama-cream)]/20 rounded-2xl border border-dashed border-[var(--color-light-gray)]/50">
            <PackageX className="w-16 h-16 text-[var(--color-light-gray)] mb-4" />
            <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-font-2 text-[var(--color-gray)] max-w-sm">
              Belum ada produk untuk kategori <strong>{activeCategory.name}</strong> saat ini.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination: Load More */}
            {hasNextPage && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isFetchingNext}
                  className="px-8 py-3 bg-white border-2 border-[var(--mama-hot-pink)] text-[var(--mama-hot-pink)] rounded-full font-bold hover:bg-[var(--mama-hot-pink)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingNext ? "Memuat..." : "Muat Lebih Banyak"}
                </button>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}