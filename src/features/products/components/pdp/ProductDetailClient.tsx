"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "./RelatedProducts";
import { ProductBottomBar } from "./ProductBottomBar";
import { ShareModal } from "./ShareModal";
import { useProductDetail } from "@/features/products/hooks/useProductDetail";
import { ProductDetail } from "@/features/products/types/product.types";
import { AddToCartModal } from "@/features/products/components/shared/AddToCartModal";
import { Product } from "@/features/products/types/products.types";

interface ProductDetailClientProps {
  product: ProductDetail;
  relatedProducts: Product[];
}

export const ProductDetailClient = ({
  product,
  relatedProducts,
}: ProductDetailClientProps) => {
  const {
    selectedVariantId,
    currentVariant,
    quantity,
    activeTab,
    activeImages,
    mainImage,
    setActiveTab,
    setMainImage,
    handleVariantSelect,
    handleQuantityChange,
  } = useProductDetail(product);

  // Manage Modals state globally within client orchestrator
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    // Added bottom padding to ensure contents do not get cut off by the sticky layout bar on mobile
    <div className="flex flex-col pb-16 md:pb-0">
      {}
      {/* Breadcrumb Navigation - Hidden on mobile, visible on tablet and desktop */}
      <nav className="hidden md:flex text-font-1 text-[var(--color-gray)] mb-6">
        <Link href="/" className="hover:text-[var(--mama-hot-pink)]">
          Beranda
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/categories/${product.category?.slug}`}
          className="hover:text-[var(--mama-hot-pink)]"
        >
          {product.category?.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--mama-brown)] font-medium">
          {product.name}
        </span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery
          images={activeImages}
          mainImage={mainImage}
          onImageSelect={setMainImage}
        />

        <ProductInfo
          product={product}
          variants={product.variants}
          currentVariant={currentVariant}
          selectedVariantId={selectedVariantId}
          quantity={quantity}
          onVariantSelect={handleVariantSelect}
          onQuantityChange={handleQuantityChange}
          onOpenCartModal={() => setIsCartModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />
      </div>

      {/* Tabs & Reviews */}
      <ProductTabs
        product={product}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Related Products Carousel/Grid */}
      <RelatedProducts products={relatedProducts} />

      {/* Shared bottom-sheet/modal for adding items to the cart */}
      <AddToCartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        product={product}
        variants={product.variants}
        currentVariant={currentVariant}
        selectedVariantId={selectedVariantId}
        quantity={quantity}
        onVariantSelect={handleVariantSelect}
        onQuantityChange={handleQuantityChange}
      />

      {/* Shared bottom-sheet/modal for sharing product */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        productName={product.name}
      />

      {/* Mobile Sticky Action Bar */}
      <ProductBottomBar
        onOpenCartModal={() => setIsCartModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />
    </div>
  );
};
