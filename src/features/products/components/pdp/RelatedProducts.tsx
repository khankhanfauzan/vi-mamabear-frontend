"use client";

import React from "react";
import ProductCard from "@/features/products/components/shared/ProductCard";
import { Product } from "@/features/products/types/products.types";

interface RelatedProductsProps {
  products: Product[];
}

export const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      <h2 className="text-font-5 font-bold text-[var(--mama-brown)] text-center mb-8">
        Produk Lainnya
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-2">
        {products.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
};
