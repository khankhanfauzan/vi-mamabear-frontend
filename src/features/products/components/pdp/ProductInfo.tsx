"use client";

import React from "react";
import {
  AlertCircle,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  StarHalf,
} from "lucide-react";
import {
  ProductDetail,
  ProductVariant,
} from "@/features/products/types/product.types";

interface ProductInfoProps {
  product: ProductDetail;
  variants: ProductVariant[];
  currentVariant: ProductVariant | null;
  selectedVariantId: number | null;
  quantity: number;
  onVariantSelect: (id: number) => void;
  onQuantityChange: (type: "increase" | "decrease") => void;
  onOpenCartModal: () => void; // New callback from parent
  onOpenShareModal: () => void; // Added share trigger
}

const formatIDR = (amount: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));
};

const formatCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}RB+`;
  }
  return count.toString();
};

export const ProductInfo = ({
  product,
  variants,
  currentVariant,
  selectedVariantId,
  quantity,
  onVariantSelect,
  onQuantityChange,
  onOpenCartModal,
  onOpenShareModal,
}: ProductInfoProps) => {
  // Check if a discount exists and is greater than 0
  const hasDiscount = Number(product.discountPercent) > 0;

  // Round the discount percentage to a whole number
  const discountPercentRounded = Math.round(Number(product.discountPercent));

  // Determine the base original price to cross out
  const baseOriginalPrice = currentVariant
    ? currentVariant.priceIdr
    : product.originalPrice || product.currentPrice;

  // Determine the active price to pay (apply discount to variant if selected)
  let activeCurrentPrice = product.currentPrice;
  if (currentVariant && hasDiscount) {
    const vPrice = Number(currentVariant.priceIdr);
    const discount = Number(product.discountPercent);
    activeCurrentPrice = (vPrice - (vPrice * discount) / 100).toString();
  }

  // Helper to render dynamic stars
  const renderStars = (rating: number, size: number) => {
    return (
      <div className="flex items-center text-[var(--mama-hot-pink)]">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          if (rating >= starValue) {
            return <Star key={index} size={size} fill="currentColor" />;
          } else if (rating >= starValue - 0.5) {
            return <StarHalf key={index} size={size} fill="currentColor" />;
          } else {
            return <Star key={index} size={size} fill="transparent" />;
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Rating */}
      <div>
        <h1 className="text-font-3 md:text-font-5 font-bold text-[var(--mama-brown)] mb-2">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 text-font-1 text-[var(--color-gray)]">
          {renderStars(product.rating || 0, 16)}
          <span className="font-bold text-[var(--mama-brown)]">
            {(product.rating || 0).toFixed(1)}
          </span>
          <span>•</span>
          <span>{formatCount(product.reviewsCount)} Penilaian</span>
          <span>•</span>
          <span>{formatCount(product.totalSold)} Terjual</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-end gap-3 flex-wrap">
        <span className="text-font-4 md:text-font-6 font-bold text-[var(--mama-hot-pink)] leading-none">
          {hasDiscount
            ? formatIDR(activeCurrentPrice)
            : formatIDR(baseOriginalPrice)}
        </span>
        {hasDiscount && (
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-font-2 md:text-font-4 line-through text-[var(--color-light-gray)]">
              {formatIDR(baseOriginalPrice)}
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercentRounded}%
            </span>
          </div>
        )}
      </div>

      {/* Variants */}
      {variants && variants.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-font-2 text-[var(--mama-brown)]">Varian</span>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = selectedVariantId === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => onVariantSelect(variant.id)}
                  className={`px-4 py-1.5 rounded-full text-font-1 transition-all font-semibold ${
                    isSelected
                      ? "bg-[var(--mama-hot-pink)] text-white border border-[var(--mama-hot-pink)]"
                      : "bg-[var(--mama-pink)] text-[var(--mama-brown)] border border-transparent hover:bg-[var(--mama-hot-pink)] hover:text-white"
                  }`}
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock & Quantity */}
      <div className="flex flex-col gap-2">
        <span className="text-font-2 text-[var(--mama-brown)]">
          Stok : {currentVariant?.stock || 0}
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-font-2 text-[var(--mama-brown)]">Jumlah</span>
          <div className="flex items-center border border-[var(--color-light-gray)] rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => onQuantityChange("decrease")}
              className="p-2 hover:bg-gray-100 text-[var(--color-gray)] transition-colors"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="px-4 text-font-2 font-medium text-[var(--mama-brown)] w-12 text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange("increase")}
              className="p-2 hover:bg-gray-100 text-[var(--color-gray)] transition-colors"
              disabled={!currentVariant || quantity >= currentVariant.stock}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Stock Warning Indicator */}
          {currentVariant && quantity >= currentVariant.stock && (
            <div className="flex items-center gap-1.5 text-red-500 animate-in fade-in zoom-in duration-200">
              <AlertCircle size={16} strokeWidth={2.5} />
              <span className="text-font-1 font-bold">
                Maksimal stok tercapai
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onOpenCartModal}
          className="flex-1 flex items-center justify-center gap-2 bg-[var(--mama-hot-pink)] text-white py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
        >
          <ShoppingCart size={20} />
          Masukkan Keranjang
        </button>
        <button
          onClick={onOpenShareModal}
          className="p-3 bg-[var(--mama-pink)] text-[var(--mama-hot-pink)] rounded-full hover:opacity-80 transition-opacity"
          aria-label="Bagikan Produk"
        >
          <Share2 size={24} />
        </button>
      </div>
    </div>
  );
};
