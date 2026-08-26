"use client";

import React, { useState } from "react";
import { Star, StarHalf, User } from "lucide-react";
import { ProductDetail } from "@/features/products/types/product.types";

interface ProductTabsProps {
  product: ProductDetail;
  activeTab: "description" | "ingredients" | "usage";
  onTabChange: (tab: "description" | "ingredients" | "usage") => void;
}

export const ProductTabs = ({
  product,
  activeTab,
  onTabChange,
}: ProductTabsProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Helper to determine if we should truncate based on description length
  const shouldTruncateDescription =
    product.description && product.description.length > 300;

  const renderStars = (rating: number, size: number) => {
    return (
      <div className="flex text-[var(--mama-hot-pink)]">
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
    <div className="mt-12 border-t border-gray-200 pt-8">
      {/* Tab Headers */}
      <div className="flex gap-8 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
        {(["description", "ingredients", "usage"] as const).map((tab) => {
          const labels = {
            description: "Deskripsi",
            ingredients: "Komposisi",
            usage: "Cara Konsumsi",
          };

          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`pb-3 text-font-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[var(--mama-brown)] text-[var(--mama-brown)]"
                  : "text-[var(--color-gray)] hover:text-[var(--mama-brown)]"
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="text-font-2 text-[var(--color-gray)] whitespace-pre-wrap leading-relaxed relative">
        {}
        {activeTab === "description" && (
          <div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                !isDescriptionExpanded && shouldTruncateDescription
                  ? "max-h-40 relative"
                  : "max-h-[9999px]" // Raised threshold to 9999px to prevent text cuts on narrow mobile screens
              }`}
            >
              {product.description}

              {/* Fade out effect at the bottom when truncated */}
              {!isDescriptionExpanded && shouldTruncateDescription && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>

            {shouldTruncateDescription && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-4 text-font-2 font-bold text-[var(--mama-hot-pink)] hover:underline focus:outline-none"
              >
                {isDescriptionExpanded ? "Sembunyikan" : "Lihat Selengkapnya"}
              </button>
            )}
          </div>
        )}

        {}
        {activeTab === "ingredients" &&
          (product.ingredients || "Informasi komposisi belum tersedia.")}

        {activeTab === "usage" &&
          (product.usageInstructions ||
            "Informasi cara konsumsi belum tersedia.")}
      </div>

      {/* Review Section */}
      {}
      <div className="mt-12">
        <h3 className="text-font-4 font-bold text-[var(--mama-brown)] mb-4">
          Review
        </h3>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-font-5 font-bold text-[var(--mama-hot-pink)]">
              {(product.rating || 0).toFixed(1)}
            </span>
            {renderStars(product.rating || 0, 20)}
            <span className="text-font-1 text-[var(--color-gray)]">
              {product.reviewsCount || 0} Penilaian
            </span>
          </div>
          <button className="text-font-1 text-[var(--color-gray)] hover:text-[var(--mama-hot-pink)] transition-colors">
            Lihat seluruh penilaian {">"}
          </button>
        </div>

        {/* Top Review Highlight */}
        {product.topReview && (
          <div className="flex gap-4 p-4 rounded-xl">
            <div className="w-12 h-12 bg-white border border-[var(--mama-pink)] text-[var(--mama-hot-pink)] rounded-full flex-shrink-0 flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <p className="font-bold text-[var(--mama-brown)] text-font-2">
                Mama
              </p>
              <div className="my-1">
                {renderStars(product.topReview.rating || 0, 12)}
              </div>
              <p className="font-bold text-[var(--mama-brown)] text-font-1 mt-2">
                &quot;{product.topReview.title}&quot;
              </p>
              <p className="text-font-1 text-[var(--color-gray)] mt-1 leading-relaxed">
                {product.topReview.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};