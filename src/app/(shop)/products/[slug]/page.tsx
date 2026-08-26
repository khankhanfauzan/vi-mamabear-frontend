import { Suspense } from "react";
import { notFound } from "next/navigation";
import { productService } from "@/features/products/services/productService";
import { ProductDetailClient } from "@/features/products/components/pdp/ProductDetailClient";
import Loading from "@/app/(shop)/products/[slug]/loading";

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

// Ensure the page takes advantage of Next.js ISR (Incremental Static Regeneration)
export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  try {
    // Fetch product details and related products concurrently for performance
    const [product, relatedProducts] = await Promise.all([
      productService.getProductBySlug(params.slug),
      productService.getRelatedProducts(params.slug),
    ]);

    if (!product) {
      notFound();
    }
    
    return (
      <main className="page-max-width py-8 px-4 md:px-8">
        {/* Suspense is mandatory here because the Client Component uses useSearchParams */}
        <Suspense
          fallback={
            <Loading />
          }
        >
          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
          />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error(
      `[ProductDetailPage] Error rendering page for slug ${params.slug}:`,
      error,
    );
    notFound();
  }
}
