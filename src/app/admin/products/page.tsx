import React from "react";
import { fetchCategories } from "@/features/categories/services/categoryService";
import AdminProductsClient from "@/features/admin/products/components/listing/AdminProductClient";
import AdminProductsHeader from "@/features/admin/products/components/listing/AdminProductsHeader";

// ==========================================
// MAIN PAGE COMPONENT (SERVER COMPONENT)
// ==========================================
export default async function AdminProductsPage() {
  const categories = await fetchCategories();

  return (
    <div className="page-max-width p-6 min-h-screen">
      {/* Header Section */}
      <AdminProductsHeader />

      {/* Client-side Component handling the interactive table & API fetching */}
      <AdminProductsClient initialCategories={categories} />
    </div>
  );
}
