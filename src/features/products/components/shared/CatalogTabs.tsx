import Link from "next/link";

/**
 * -------------------------------------------------------------------------
 * SUB-COMPONENT: CatalogTabs
 * -------------------------------------------------------------------------
 */
export default function CatalogTabs({
  activeTab = "products",
}: {
  activeTab?: "products" | "categories";
}) {
  return (
    <div className="flex items-center gap-8 mb-6 border-b border-stone-100 w-full">
      <Link
        href="/products"
        className={`pb-3 text-sm transition-all ${
          activeTab === "products"
            ? "font-bold text-primary border-b-2 border-primary"
            : "font-semibold text-stone-500 hover:text-stone-800 border-b-2 border-transparent"
        }`}
      >
        Produk
      </Link>
      <Link
        href="/categories"
        className={`pb-3 text-sm transition-all ${
          activeTab === "categories"
            ? "font-bold text-primary border-b-2 border-primary"
            : "font-semibold text-stone-500 hover:text-stone-800 border-b-2 border-transparent"
        }`}
      >
        Kategori
      </Link>
    </div>
  );
}
