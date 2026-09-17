"use client";

import type { ChatProduct } from "@/features/chat/types/chat.types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function formatSold(value?: number) {
  if (value === undefined) return null;
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}RB+`;
  }
  return value.toString();
}

function formatPrice(product: ChatProduct) {
  if (product.formattedPrice) return product.formattedPrice;
  if (product.price === undefined) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);
}

type ProductChatCardProps = {
  data: ChatProduct[];
};

export function ProductChatCard({ data }: ProductChatCardProps) {
  if (!data?.length) return null;

  return (
    <ul className="mt-2 space-y-2">
      {data.map((product) => {
        const href = `/products/${product.slug || product.id}`;
        const sold = formatSold(product.totalSold);
        const price = formatPrice(product);
        const imageSrc = product.imageUrl || "/images/layout/logo.png";

        return (
          <li
            key={String(product.id)}
            className="overflow-hidden rounded-xl border border-[var(--mama-pink)] bg-white shadow-sm"
          >
            <div className="flex gap-3 p-2.5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--mama-cream)]">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                {product.category && (
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--mama-hot-pink)]">
                    {product.category}
                  </p>
                )}
                <p className="line-clamp-2 text-sm font-semibold text-[var(--mama-brown)]">
                  {product.name}
                </p>
                {product.shortDescription && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--color-gray)]">
                    {product.shortDescription}
                  </p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  {price && (
                    <span className="text-sm font-bold text-[var(--mama-hot-pink)]">
                      {price}
                    </span>
                  )}
                  {product.rating !== undefined && (
                    <span className="inline-flex items-center gap-0.5 text-[11px] text-[var(--color-gray)]">
                      <Star className="h-3 w-3 fill-[var(--mama-hot-pink)] text-[var(--mama-hot-pink)]" />
                      {product.rating.toFixed(1)}
                      {product.reviewCount !== undefined && (
                        <span>({product.reviewCount.toLocaleString("id-ID")})</span>
                      )}
                    </span>
                  )}
                  {sold && (
                    <span className="text-[11px] text-[var(--color-gray)]">
                      {sold} terjual
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-[var(--mama-pink)] px-2.5 py-2">
              <Link
                href={href}
                className="flex h-8 items-center justify-center rounded-full bg-[var(--mama-hot-pink)] text-xs font-semibold text-white hover:brightness-95"
              >
                Lihat Produk
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
