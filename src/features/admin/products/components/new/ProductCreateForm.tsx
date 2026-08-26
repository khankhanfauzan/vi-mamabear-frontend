"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { Category } from "@/features/categories/types/category.types";

import ProductBasicInfoSection from "./ProductBasicInfo";
import ProductAdditionalDetailsSection from "./ProductAdditionalDetails";
import ProductPricingInventorySection from "./ProductPricingInventory";
import ProductImagesSection from "./ProductImagesSection";
import ProductVariantsSection from "./ProductVariantsSection";
import ProductSeoSection from "./ProductSEOSection";
import ProductStatusSidebar from "./ProductStatusSidebar";
import { useCreateProduct } from "@/features/admin/products/hooks/useCreateProduct";

interface ProductCreateFormProps {
  categories: Category[];
}

/**
 * ProductCreateForm
 * Main Client orchestrator component importing isolated sections and linking UI states directly to hook state controllers.
 */
export default function ProductCreateForm({
  categories,
}: ProductCreateFormProps) {
  const router = useRouter();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const {
    form: {
      register,
      formState: { errors },
    },
    isLoading,
    errorMsg,
    selectedImages,
    handleImageChange,
    removeImage,
    moveImage,
    onSubmit,
  } = useCreateProduct();

  return (
    <>
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--mama-brown)]" />
          </button>
          <div>
            <h1 className="text-font-4 md:text-font-5 font-bold text-[var(--mama-brown)]">
              Tambah Produk Baru
            </h1>
            <p className="text-font-2 text-[var(--color-gray)]">
              Buat produk baru
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ProductBasicInfoSection
              register={register}
              errors={errors}
              categories={categories}
            />

            <ProductAdditionalDetailsSection register={register} />

            <ProductPricingInventorySection
              register={register}
              errors={errors}
            />

            <ProductImagesSection
              selectedImages={selectedImages}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              moveImage={moveImage}
              onZoom={setZoomedImage}
            />

            <ProductVariantsSection />

            <ProductSeoSection register={register} />
          </div>

          {/* Right Column (Sidebar Action) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ProductStatusSidebar
              register={register}
              isLoading={isLoading}
              onCancel={() => router.back()}
            />
          </div>
        </div>
      </form>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={() => setZoomedImage(null)}
          />
          <button
            type="button"
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 p-2 text-white bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed Preview"
            className="relative z-10 max-w-[90vw] max-h-[90vh] object-contain rounded-md"
          />
        </div>
      )}
    </>
  );
}
