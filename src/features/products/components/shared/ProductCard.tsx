"use client";

import { Product } from "@/features/products/types/products.types";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const formatSold = (value: number | string) => {
  if (typeof value === "string" && /[a-zA-Z+]/.test(value)) return value;
  const num = Number(value);
  if (isNaN(num)) return value;
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}RB+`;
  }
  return num.toString();
};

export default function ProductCard({
  product,
}: {
  product: Omit<Product, "category">;
}) {
  // Ambil gambar utama atau gunakan placeholder
  // TODO: add break image placeholder
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0].imageUrl
      : "/images/layout/logo.png";

  // Gunakan field analytical baru, fallback ke harga varian pertama jika tidak ada
  const currentPriceStr =
    product.currentPrice ||
    (product.variants && product.variants.length > 0
      ? product.variants[0].priceIdr
      : "0");
  const originalPriceStr = product.originalPrice;
  const discount = Math.round(Number(product.discountPercent));
  const rating = product.rating || 0.0;
  const rawSold = product.totalSold || 0;
  const sold = formatSold(rawSold);

  // Menggunakan tag pertama sebagai badge jika tersedia
  // const badge =
  //   product.tags && product.tags.length > 0 ? product.tags[0] : null;
  const badge = product.highlight?.name;

  // Format harga ke IDR
  const formattedCurrentPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(parseInt(currentPriceStr, 10));

  const formattedOriginalPrice = originalPriceStr
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(parseInt(originalPriceStr, 10))
    : null;

  return (
    // TODO: this card is not uniform when using flex
    <Link
      href={`/products/${product.slug}`}
      className="group flex overflow-hidden flex-col bg-white rounded-2xl hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 border border-transparent hover:border-pink-100 cursor-pointer relative h-full min-w-[140px] max-w-[280px] w-full mx-auto"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-square bg-stone-50 overflow-hidden">
        <div className="absolute top-2 left-2 z-10 flex gap-1 flex-wrap">
          {!!discount && (
            <span className="text-[14px] font-bold px-1.5 py-0.5 bg-red-500 text-white shadow-sm w-fit">
              {discount}%
            </span>
          )}
          {badge && (
            <span className="text-[14px] font-bold px-1.5 py-0.5 bg-pink-200 text-primary shadow-sm uppercase w-fit">
              {badge}
            </span>
          )}
        </div>

        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col py-3 px-4">
        <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-2">
          {product.name}
        </h3>

        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-xs font-bold text-stone-600">
                {rating.toFixed(1)}
              </span>
              <span className="text-[10px] font-medium text-stone-500 ml-1">
                {sold} Terjual
              </span>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col">
                {!!discount && formattedOriginalPrice && (
                  <span className="text-[10px] text-stone-400 line-through leading-none mb-0.5">
                    {formattedOriginalPrice}
                  </span>
                )}
                <span className="text-lg font-black text-red-500 tracking-tight">
                  {formattedCurrentPrice}
                </span>
              </div>
            </div>
          </div>

          <button
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary hover:scale-110 active:scale-95 transition-all shrink-0 pb-[-12rem]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Add to cart logic here
            }}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
