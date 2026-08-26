import ProductCard from "@/features/products/components/shared/ProductCard";
import { Product } from "@/features/products/types/products.types";

export function FeaturedProducts({ products }: { products?: Product[] }) {
  // Use API products if available, fallback to empty array, and limit to 4 items
  // TODO: limit in fetching and remove mock with error component
  const displayProducts: Product[] = products ?? [];

  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <h2 className="text-2xl font-bold text-[var(--mama-brown)] text-center mb-8">
          MamaBear Highlight
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {displayProducts?.map(function renderProduct(product) {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </section>
  );
}