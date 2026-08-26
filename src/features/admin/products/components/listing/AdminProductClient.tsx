"use client";

import React, { useState } from "react";
import {
  bulkUpdateProductsStatus,
  bulkDeleteProducts,
  duplicateProduct,
  exportProductsCsv,
} from "@/features/admin/products/services/adminListingProductService";
import ProductFilters from "@/features/admin/products/components/listing/ProductFilters";
import ProductTable from "@/features/admin/products/components/listing/ProductTable";
import PaginationFooter from "@/features/admin/products/components/listing/PaginationFooter";
import DeleteConfirmModal from "@/features/admin/products/components/listing/DeleteConfirmModal";
import type { Category } from "@/features/categories/types/category.types";
import BulkActionsBar from "@/features/admin/products/components/listing/BulkActionBar";
import { useAdminListingProducts } from "@/features/admin/products/hooks/useAdminListingProducts";

interface AdminProductsClientProps {
  initialCategories: Category[];
}

/**
 * AdminProductsClient
 * Clean main client orchestrator component that aggregates modular presentational sub-components.
 */
export default function AdminProductsClient({
  initialCategories,
}: AdminProductsClientProps) {
  const {
    products,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    inStock,
    setInStock,
    isActive,
    setIsActive,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
    page,
    totalPages,
    totalItems,
    handlePageChange,
    refreshProducts,
    resetFilters,
    selectedProductIds,
    setSelectedProductIds,
  } = useAdminListingProducts();

  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
    null,
  );
  const [bulkError, setBulkError] = useState<string | null>(null);

  // Toggle selection logic
  const isAllSelected =
    products.length > 0 && selectedProductIds.length === products.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(products.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleToggleProduct = (id: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const handleBulkStatusUpdate = async (isActiveStatus: boolean) => {
    setIsBulkProcessing(true);
    setBulkError(null);
    try {
      await bulkUpdateProductsStatus(selectedProductIds, isActiveStatus);
      setSelectedProductIds([]);
      refreshProducts();
    } catch {
      setBulkError("Gagal memperbarui status beberapa produk.");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Trigger delete modal for a single product from table row options
  const handleDeletePromptSingle = (id: number) => {
    setProductIdToDelete(id);
    setShowDeleteModal(true);
  };

  // Trigger delete modal for multiple selected checkboxes
  const handleDeletePromptBulk = () => {
    setProductIdToDelete(null); // Ensure single deletion state is cleared
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsBulkProcessing(true);
    setBulkError(null);
    try {
      if (productIdToDelete !== null) {
        // Execute optimized bulk-delete request with single item payload
        await bulkDeleteProducts([productIdToDelete]);
        setProductIdToDelete(null);
      } else {
        // Execute bulk-delete request with selected items payload
        await bulkDeleteProducts(selectedProductIds);
        setSelectedProductIds([]);
      }
      setShowDeleteModal(false);
      refreshProducts();
    } catch {
      setBulkError("Gagal menghapus produk.");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductIdToDelete(null);
  };

  const handleDuplicateProduct = async (id: number) => {
    setBulkError(null);
    try {
      await duplicateProduct(id);
      refreshProducts(); // Refresh list to show duplicated item
    } catch {
      setBulkError("Gagal menduplikat produk.");
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    setBulkError(null);
    try {
      const blob = await exportProductsCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `mamabear-products-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();

      // Clean up URL and link element
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setBulkError("Gagal mengekspor data produk ke CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resetFilters={resetFilters}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        initialCategories={initialCategories}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        inStock={inStock}
        setInStock={setInStock}
        isActive={isActive}
        setIsActive={setIsActive}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onExport={handleExportCsv}
        isExporting={isExporting}
      />

      <BulkActionsBar
        selectedCount={selectedProductIds.length}
        isBulkProcessing={isBulkProcessing}
        bulkError={bulkError}
        onPublish={() => handleBulkStatusUpdate(true)}
        onUnpublish={() => handleBulkStatusUpdate(false)}
        onDeletePrompt={handleDeletePromptBulk}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ProductTable
          products={products}
          isLoading={isLoading}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
          selectedProductIds={selectedProductIds}
          onToggleProduct={handleToggleProduct}
          onDuplicateProduct={handleDuplicateProduct}
          onDeleteProduct={handleDeletePromptSingle}
        />
        <PaginationFooter
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          selectedCount={selectedProductIds.length}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isProcessing={isBulkProcessing}
        selectedCount={
          productIdToDelete !== null ? 1 : selectedProductIds.length
        }
      />
    </>
  );
}
