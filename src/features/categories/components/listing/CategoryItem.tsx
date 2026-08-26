"use client";

import Link from "next/link";
import { Category } from "@/features/categories/types/category.types";

interface CategoryItemProps {
  category: Category;
}

export function CategoryItem({ category }: CategoryItemProps) {
  // Safely extract the first image or fallback to a placeholder
  const imageUrl = category.images?.[0]?.imageUrl || "/images/layout/logo.png";
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="flex items-center gap-4 group py-2"
    >
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex-shrink-0 bg-[var(--mama-cream)] shadow-sm border-2 border-transparent group-hover:border-[var(--mama-hot-pink)] transition-all duration-300">
        <img
          src={imageUrl}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <span className="text-font-2 md:text-font-3 font-medium text-[var(--mama-brown)] group-hover:text-[var(--mama-hot-pink)] transition-colors">
        {category.name}
      </span>
    </Link>
  );
}