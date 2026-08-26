"use client";

import Link from "next/link";
import { Category } from "@/features/categories/types/category.types";

interface CategorySidebarProps {
  categories: Category[];
}

export function CategorySidebar({ categories }: CategorySidebarProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <aside className="hidden md:block w-48 lg:w-64 flex-shrink-0 pr-8 py-4">
      <nav className="sticky top-24 flex flex-col gap-8">
        <div>
          <h3 className="text-font-2 font-bold text-[var(--mama-brown)] mb-4">
            Semua Kategori
          </h3>
          <ul className="flex flex-col gap-3">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link 
                  href={`/categories/${cat.slug}`} 
                  className="text-font-2 text-[var(--color-gray)] hover:text-[var(--mama-hot-pink)] transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}