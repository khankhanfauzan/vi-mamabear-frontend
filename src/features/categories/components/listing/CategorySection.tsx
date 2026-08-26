"use client";

import { Category } from "@/features/categories/types/category.types";
import { CategoryItem } from "./CategoryItem";

interface CategorySectionProps {
  id: string;
  title: string;
  categories: Category[];
}

export function CategorySection({ id, title, categories }: CategorySectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <h2 className="text-font-4 md:text-font-5 font-bold text-[var(--mama-brown)] mb-4">
        {title}
      </h2>
      <hr className="border-t border-[var(--color-light-gray)]/30 mb-6" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}