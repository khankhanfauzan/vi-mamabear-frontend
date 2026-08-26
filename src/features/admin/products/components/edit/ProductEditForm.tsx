"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { Category } from "@/features/categories/types/category.types";
import {
  Product,
  ProductFormValues,
} from "@/features/admin/products/types/product.types";
import { useEditProduct } from "@/features/admin/products/hooks/useEditProduct";
import ProductBasicInfoSection from "@/features/admin/products/components/new/ProductBasicInfo";
import ProductAdditionalDetailsSection from "@/features/admin/products/components/new/ProductAdditionalDetails";
import ProductVariantsSection from "@/features/admin/products/components/new/ProductVariantsSection";
import ProductSeoSection from "@/features/admin/products/components/new/ProductSEOSection";
import ProductStatusSidebar from "@/features/admin/products/components/new/ProductStatusSidebar";
import ProductImagesSection from "@/features/admin/products/components/new/ProductImagesSection";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface ProductEditFormProps {
  categories: Category[];
  initialData: Product;
}

/**
 * ProductEditForm
 * Edit orchestrator component. Notably excludes the base pricing inventory section,
 * pushing all price/stock logic completely to the dynamic variants manager.
 */
export default function ProductEditForm({
  categories,
  initialData,
}: ProductEditFormProps) {
  const router = useRouter();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const {
    form: {
      register,
      formState: { errors },
    },
    isLoading,
    errorMsg,
    images,
    handleImageChange,
    removeImage,
    moveImage,
    onSubmit,
  } = useEditProduct(initialData);

  // Safely cast the register and errors to match the shared Create form components
  // without using 'any' to satisfy ESLint strict rules.
  const sharedRegister =
    register as unknown as UseFormRegister<ProductFormValues>;
  const sharedErrors = errors as unknown as FieldErrors<ProductFormValues>;

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
              Edit Produk
            </h1>
            <p className="text-font-2 text-[var(--color-gray)]">
              Perbarui detail untuk:{" "}
              <span className="font-semibold">{initialData.name}</span>
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
            {/* Note: Ignoring the base `ProductPricingInventorySection` as it operates at the Variant level post-creation */}
            <ProductBasicInfoSection
              register={sharedRegister}
              errors={sharedErrors}
              categories={categories}
            />

            <ProductAdditionalDetailsSection register={sharedRegister} />

            <ProductImagesSection
              selectedImages={images}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              moveImage={moveImage}
              onZoom={setZoomedImage}
            />

            {/* Passes the active productId, switching this section strictly into interactive Edit Mode */}
            <ProductVariantsSection
              productId={initialData.id}
              initialVariants={initialData.variants}
            />

            <ProductSeoSection register={sharedRegister} />
          </div>

          {/* Right Column (Sidebar Action) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ProductStatusSidebar
              register={sharedRegister}
              isLoading={isLoading}
              isEditMode={true}
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
