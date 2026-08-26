import { Suspense } from "react";
import { notFound } from "next/navigation";
import { adminProductService } from "@/features/admin/products/services/adminProductService";
import { adminCategoryService } from "@/features/admin/categories/services/adminCategoryService";
import ProductEditForm from "@/features/admin/products/components/edit/ProductEditForm";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Edit Produk | Admin MamaBear",
  description: "Perbarui informasi produk e-commerce MamaBear",
};

interface EditPageProps {
  params: {
    id: string;
  };
}

/**
 * Admin Product Edit Page (Server Component)
 * Prefetches both the specific product payload and the global categories list concurrently.
 */
export default async function AdminProductEditPage({ params }: EditPageProps) {
  const productId = parseInt(params.id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  // Run data fetching requests concurrently to speed up server rendering times
  const [productResult, categoriesResult] = await Promise.allSettled([
    adminProductService.fetchProductById(productId),
    adminCategoryService.fetchCategories(),
  ]);

  // If the product fetch fails, fallback to NextJS 404 block
  if (productResult.status === "rejected" || !productResult.value) {
    notFound();
  }

  const product = productResult.value;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  return (
    <div className="page-max-width py-8 px-4 md:px-8 min-h-screen">
      <Suspense
        fallback={
          <div className="animate-pulse w-full h-[600px] bg-gray-200 rounded-lg"></div>
        }
      >
        <ProductEditForm categories={categories} initialData={product} />
      </Suspense>
    </div>
  );
}
