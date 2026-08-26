import { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryService } from "@/features/categories/services/categoryService";
import { Category } from "@/features/categories/types/category.types";
import {CategoryDetailClient} from "@/features/categories/components/cdp/CategoryDetailClient";
import ProductListingBanner from "@/features/products/components/listing/ProductListingBanner";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categories = await categoryService.fetchCategories().catch(() => []);
  const activeCategory = categories.find((c) => c.slug === params.slug);

  if (!activeCategory) {
    return { title: "Kategori Tidak Ditemukan | MamaBear" };
  }

  return {
    title: `${activeCategory.name} | MamaBear`,
    description: activeCategory.metaDescription || activeCategory.description,
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  // Fetch categories on the server to pass down to the sidebar and find the active one
  let allCategories: Category[] = [];
  try {
    allCategories = await categoryService.fetchCategories();
  } catch (error) {
    console.error("[CategoryDetailPage] Failed to fetch categories:", error);
  }

  const activeCategory = allCategories.find((c) => c.slug === params.slug);

  // If the user visits a slug that doesn't exist, throw Next.js 404
  if (!activeCategory) {
    notFound();
  }

  return (
    <div className="page-max-width w-full min-h-screen">
      <ProductListingBanner />
      <CategoryDetailClient
        activeCategory={activeCategory}
        allCategories={allCategories}
      />
    </div>
  );
}
