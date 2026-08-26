import React from "react";
import ProductListingBanner from "@/features/products/components/listing/ProductListingBanner";
import ProductCatalogClient from "@/features/products/components/listing/ProductCatalogClient";
import { fetchCategories } from "@/features/categories/services/categoryService";
import { CategoryItem } from "@/features/products/types/products.types";

/**
 * -------------------------------------------------------------------------
 * MAIN PAGE: ProductListingPage (SERVER COMPONENT)
 * This page runs on the server, fetches initial category data, and passes
 * it down to the Client Component for interactivity.
 * -------------------------------------------------------------------------
 */
export default async function ProductListingPage() {
  let categories: CategoryItem[] | null = [];
  const response = await fetchCategories();
  categories = [{ name: "Semua Produk", slug: "all" }, ...(response || [])];

  return (
    <>
      <div className="min-h-screen bg-white pb-24">
        {/* 1. Static/Dumb Banner */}
        <ProductListingBanner />

        {/* 2. Interactive Client Component */}
        <section className="mx-auto page-spacing">
          <ProductCatalogClient initialCategories={categories} />
        </section>
      </div>
    </>
  );
}
