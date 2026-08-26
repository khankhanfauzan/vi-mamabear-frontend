import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

import { fetchCategories } from "@/features/categories/services/categoryService";
import { Category } from "../../types/category.types";

export async function CategoriesMegaMenu() {
  const categories = await fetchCategories();

  if (!categories) {
    return null;
  }

  return (
    <div className="relative hidden lg:block group">
      {/* Trigger */}
      <button className="flex items-center gap-2 font-bold text-[var(--mama-brown)] hover:text-pink-600 transition-colors">
        Kategori

        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>

      {/* Mega Menu */}
      <div className="absolute top-full left-0 pt-5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="w-[820px] rounded-[40px] border border-pink-100 bg-white shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-pink-100 bg-pink-50/40">
            <p className="text-pink-400 text-xs font-black uppercase tracking-[0.25em] mb-2">
              Kategori Produk
            </p>

            <h2 className="text-3xl font-black text-[#8B5E3C]">
              Temukan Nutrisi Terbaik
            </h2>

            <p className="text-stone-500 text-sm mt-2 max-w-lg">
              Pilihan produk sehat untuk mendukung perjalanan Mama &
              Si Kecil setiap hari.
            </p>
          </div>

          {/* Categories */}
          <div className="p-6 grid grid-cols-4 gap-4">
          {categories.map((category: Category) => (
            <Link
               key={category.id}
               href={`/categories/${category.slug}`}
               className="relative h-48 overflow-hidden rounded-[32px] group/item"
            >
               {/* Background Image */}
               <img
                  src={
                  category.images?.[0]?.imageUrl ||
                  "https://placehold.co/1200x600"
                  }
                  alt={category.name}
                  className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-500
                  group-hover/item:scale-105
                  "
               />

               {/* Dark Overlay */}
               <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/10" />

               {/* Content */}
               <div className="relative z-10 h-full flex items-center justify-between px-8">
                  <div className="max-w-md">
                     <p className="text-pink-200 text-xs font-black uppercase tracking-[0.25em] mb-2">
                        Kategori Produk
                     </p>

                     <h3 className="text-3xl font-black text-white">
                        {category.name}
                     </h3>

                     <p className="text-white/80 text-sm mt-2">
                        {category.description ||
                           "Produk sehat terbaik untuk Mama & Si Kecil."}
                     </p>
                  </div>

                  <div
                  className="
                     w-14
                     h-14
                     rounded-full
                     bg-white/20
                     backdrop-blur
                     flex
                     items-center
                     justify-center
                     group-hover/item:bg-pink-500
                     transition-colors
                  "
                  >
                     <ChevronRight className="w-6 h-6 text-white" />
                  </div>
               </div>
            </Link>
         ))}
         </div>
        </div>
      </div>
    </div>
  );
}
