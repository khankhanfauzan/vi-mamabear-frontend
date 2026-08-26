"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Trash2,
  ChevronDown,
  Star,
  Loader2,
  PackageX,
  Filter,
} from "lucide-react";
import {
  CategoryItem,
  Product,
  ProductFilterParams,
} from "@/features/products/types/products.types";
import { fetchFilteredProducts } from "@/features/products/services/productsService";
import ProductCard from "@/features/products/components/shared/ProductCard";
import ProductSkeletonCard from "@/features/products/components/shared/ProductSkeletonCard";
import CatalogTabs from "@/features/products/components/shared/CatalogTabs";

/**
 * -------------------------------------------------------------------------
 * CUSTOM HOOK: useProductList
 * Handles data fetching based on active filters.
 * -------------------------------------------------------------------------
 */
function useProductList(
  activeCategorySlugs: string[],
  minPrice?: number,
  maxPrice?: number,
  inStock?: boolean,
  sortOption?: string,
  minRating?: number,
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 8;

  // Reset pagination when any filter changes
  useEffect(() => {
    setCursor(undefined);
    setNextCursor(undefined);
    setHasMore(true);
  }, [activeCategorySlugs, minPrice, maxPrice, inStock, sortOption, minRating]);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      if (!cursor) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const params: ProductFilterParams =
          activeCategorySlugs.length === 0 ||
          activeCategorySlugs.includes("all")
            ? {}
            : { categories: activeCategorySlugs };

        if (minPrice !== undefined && minPrice > 0) params.minPrice = minPrice;
        if (maxPrice !== undefined && maxPrice < 1000000)
          params.maxPrice = maxPrice;
        if (inStock !== undefined) params.inStock = inStock;
        if (minRating !== undefined && minRating > 0)
          params.minRating = minRating;

        // Map the selected sort option to the service parameters
        if (sortOption === "harga-rendah") params.priceAscending = 1;
        if (sortOption === "harga-tinggi") params.priceAscending = 0;
        if (sortOption === "terbaru") params.creationDateAscending = 0;
        if (sortOption === "terpopuler") params.popularAscending = 0;
        if (sortOption === "rating") params.ratingAscending = 0;

        // Append pagination params to the API request
        if (cursor) params.cursor = cursor;
        params.limit = LIMIT;

        const response = await fetchFilteredProducts(params);

        if (isMounted) {
          if (response && response.success && response.data) {
            const fetchedData = response.data;

            // If no cursor, overwrite. Otherwise, append to existing products
            if (!cursor) {
              setProducts(fetchedData);
            } else {
              setProducts((prev) => [...prev, ...fetchedData]);
            }

            // Determine next cursor (support multiple common API response patterns)
            let newNextCursor =
              ("nextCursor" in response
                ? (response as { nextCursor?: string }).nextCursor
                : undefined) ?? response.pagination?.nextCursor;

            // Fallback: If backend doesn't explicitly provide nextCursor but we received full limit,
            // we use the last item's ID as the next cursor.
            if (newNextCursor === undefined && fetchedData.length > 0) {
              newNextCursor = fetchedData[fetchedData.length - 1].id.toString();
            }

            // Determine if there are more products to fetch
            if (fetchedData.length >= LIMIT && newNextCursor) {
              setHasMore(true);
              setNextCursor(newNextCursor);
            } else {
              setHasMore(false);
              setNextCursor(undefined);
            }
          } else {
            if (!cursor) setProducts([]);
            setHasMore(false);
          }
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (isMounted) {
          setError("Gagal memuat produk. Silakan coba lagi.");
          if (!cursor) setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [
    activeCategorySlugs,
    minPrice,
    maxPrice,
    inStock,
    sortOption,
    minRating,
    cursor,
  ]);

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore && nextCursor) {
      setCursor(nextCursor);
    }
  };

  return { products, loading, loadingMore, error, hasMore, loadMore };
}

/**
 * -------------------------------------------------------------------------
 * SUB-COMPONENT: ProductSidebarFilter
 * -------------------------------------------------------------------------
 */

interface ProductSidebarFilterProps {
  activeCategories: string[];
  toggleCategory: (slug: string) => void;
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  minPrice: number;
  maxPrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
  inStockStatus: boolean | undefined;
  setInStockStatus: (val: boolean | undefined) => void;
  minRating: number | undefined;
  setMinRating: (val: number | undefined) => void;
  clearFilters: () => void;
}

function ProductSidebarFilter({
  activeCategories,
  toggleCategory,
  isOpen,
  onClose,
  categories,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  inStockStatus,
  setInStockStatus,
  minRating,
  setMinRating,
  clearFilters,
}: ProductSidebarFilterProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-white p-6 overflow-y-auto transition-transform duration-300
        lg:static lg:translate-x-0 lg:p-0 lg:pr-8 lg:border-r lg:border-stone-100 lg:z-auto lg:block shrink-0
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between pb-6 border-b border-stone-100 mb-6 mt-4 lg:mt-0">
          <h2 className="text-2xl font-black text-[#8B5E3C]">Filter</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={clearFilters}
              className="flex flex-col items-center text-stone-400 hover:text-stone-600 transition-colors"
            >
              <Trash2 className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">Hapus</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-stone-800 mb-4">Kategori</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: CategoryItem) => {
              const isActive =
                activeCategories.includes(cat.slug) ||
                (cat.slug === "all" && activeCategories.length === 0);
              const isSale =
                cat.slug === "sale" || cat.name.toUpperCase() === "SALE";

              let btnClass =
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all ";
              if (isActive) {
                btnClass += "bg-[#D65D7A] text-white shadow-md shadow-pink-200";
              } else if (isSale) {
                btnClass += "bg-pink-50 text-red-500 hover:bg-pink-100";
              } else {
                btnClass += "bg-pink-50 text-pink-400 hover:bg-pink-100";
              }

              return (
                <button
                  key={cat.slug}
                  onClick={() => toggleCategory(cat.slug)}
                  className={btnClass}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-stone-800 mb-4">Harga</h3>
          <div className="px-2">
            <div className="relative h-4 w-full mb-4">
              <div className="absolute inset-0 h-1 top-1.5 bg-stone-200 rounded-full"></div>
              <div
                className="absolute h-1 top-1.5 bg-[#D65D7A] rounded-full pointer-events-none"
                style={{
                  left: `${(minPrice / 1000000) * 100}%`,
                  right: `${100 - (maxPrice / 1000000) * 100}%`,
                }}
              ></div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(
                    Math.min(Number(e.target.value), maxPrice - 10000),
                  )
                }
                className="absolute w-full top-1.5 h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#D9D9D9] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#D65D7A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm z-10"
              />
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    Math.max(Number(e.target.value), minPrice + 10000),
                  )
                }
                className="absolute w-full top-1.5 h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[#D9D9D9] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#D65D7A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm z-20"
              />
            </div>
            <div className="flex justify-between text-xs font-bold text-stone-500">
              <span>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(minPrice)}
              </span>
              <span>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(maxPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-stone-800 mb-4">Rating</h3>
          <div className="flex flex-col gap-2">
            {[4, 3, 2, 1].map((rating) => {
              const isActive = minRating === rating;
              return (
                <button
                  key={rating}
                  onClick={() => setMinRating(isActive ? undefined : rating)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
                    isActive
                      ? "bg-[#D65D7A] border-[#D65D7A] text-white shadow-md"
                      : "bg-white border-stone-200 text-stone-600 hover:border-pink-100 hover:bg-pink-50/50"
                  }`}
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating
                            ? isActive
                              ? "fill-white text-white"
                              : "fill-yellow-400 text-yellow-400"
                            : isActive
                              ? "fill-white/30 text-white/30"
                              : "fill-stone-100 text-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold">{rating} Ke Atas</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-stone-800 mb-4">Stok</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                setInStockStatus(inStockStatus === true ? undefined : true)
              }
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                inStockStatus === true
                  ? "bg-[#D65D7A] text-white shadow-md shadow-pink-200"
                  : "bg-pink-50 text-pink-400 hover:bg-pink-100"
              }`}
            >
              Tersedia
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/**
 * -------------------------------------------------------------------------
 * SUB-COMPONENT: ProductSortBar
 * -------------------------------------------------------------------------
 */

interface ProductSortBarProps {
  onOpenFilter: () => void;
  count: number;
  currentSort: string;
  onSortChange: (val: string) => void;
}

function ProductSortBar({
  onOpenFilter,
  count,
  currentSort,
  onSortChange,
}: ProductSortBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { id: "terpopuler", label: "Terpopuler" },
    { id: "terbaru", label: "Terbaru" },
    { id: "harga-rendah", label: "Harga: Rendah ke Tinggi" },
    { id: "harga-tinggi", label: "Harga: Tinggi ke Rendah" },
    { id: "rating", label: "Rating Tertinggi" },
  ];

  const currentLabel =
    sortOptions.find((o) => o.id === currentSort)?.label || "Terpopuler";

  return (
    <div className="flex justify-between items-center mb-6 lg:justify-end gap-4">
      <button
        onClick={onOpenFilter}
        className="lg:hidden px-4 py-2 bg-stone-50 rounded-full text-xs font-bold text-stone-600 active:bg-stone-100 transition-colors shrink-0 flex"
      >
        <Filter size={14} className="mr-1" />
        Filter
      </button>
      <div className="hidden md:block mr-auto">
        <span className="text-sm font-semibold text-stone-500">
          Menampilkan {count} produk
        </span>
      </div>
      <div className="flex items-center gap-3 relative">
        <span className="hidden sm:inline text-sm font-bold text-stone-600">
          Urutkan
        </span>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-full text-sm font-semibold text-stone-700 hover:border-pink-300 transition-colors bg-white whitespace-nowrap"
          >
            {currentLabel}{" "}
            <ChevronDown
              className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <>
              {/* Invisible overlay to close dropdown when clicking outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />

              <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-100 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      currentSort === option.id
                        ? "text-pink-600 font-bold bg-pink-50"
                        : "text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900"
                    }`}
                    onClick={() => {
                      onSortChange(option.id);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * -------------------------------------------------------------------------
 * MAIN CLIENT COMPONENT: ProductCatalogContent
 * -------------------------------------------------------------------------
 */
function ProductCatalogContent({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeCategories, setActiveCategories] = useState<string[]>(() => {
    const catParam = searchParams.get("categories");
    return catParam ? catParam.split(",") : [];
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [minPrice, setMinPrice] = useState<number>(
    () => Number(searchParams.get("minPrice")) || 0,
  );
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const max = searchParams.get("maxPrice");
    return max ? Number(max) : 1000000;
  });

  const [debouncedMinPrice, setDebouncedMinPrice] = useState<number>(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState<number>(maxPrice);

  // Stock filter state (true = Tersedia, false = Pre-Order, undefined = Both)
  const [inStockStatus, setInStockStatus] = useState<boolean | undefined>(
    () => {
      const stockParam = searchParams.get("inStock");
      if (stockParam === "true") return true;
      if (stockParam === "false") return false;
      return undefined;
    },
  );

  // Rating filter state
  const [minRating, setMinRating] = useState<number | undefined>(() => {
    const ratingParam = searchParams.get("minRating");
    return ratingParam ? Number(ratingParam) : undefined;
  });

  // Sorting state
  const [sortOption, setSortOption] = useState<string>(
    () => searchParams.get("sort") || "terpopuler",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 500);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]);

  // Sync State to URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (activeCategories.length > 0)
      params.set("categories", activeCategories.join(","));
    else params.delete("categories");

    if (debouncedMinPrice > 0)
      params.set("minPrice", debouncedMinPrice.toString());
    else params.delete("minPrice");

    if (debouncedMaxPrice < 1000000)
      params.set("maxPrice", debouncedMaxPrice.toString());
    else params.delete("maxPrice");

    if (inStockStatus !== undefined)
      params.set("inStock", inStockStatus.toString());
    else params.delete("inStock");

    if (minRating !== undefined && minRating > 0)
      params.set("minRating", minRating.toString());
    else params.delete("minRating");

    if (sortOption !== "terpopuler") params.set("sort", sortOption);
    else params.delete("sort");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    activeCategories,
    debouncedMinPrice,
    debouncedMaxPrice,
    inStockStatus,
    minRating,
    sortOption,
    pathname,
    router,
    searchParams,
  ]);

  const clearFilters = () => {
    setActiveCategories([]);
    setMinPrice(0);
    setMaxPrice(1000000);
    setInStockStatus(undefined);
    setMinRating(undefined); // Reset rating filter on clear
    setSortOption("terpopuler");
  };

  const toggleCategory = (slug: string) => {
    if (slug === "all") {
      clearFilters();
      return;
    }

    setActiveCategories((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((c) => c !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  // Pass all filters into the hook
  const {
    products,
    loading: loadingProducts,
    loadingMore,
    error,
    hasMore,
    loadMore,
  } = useProductList(
    activeCategories,
    debouncedMinPrice,
    debouncedMaxPrice,
    inStockStatus,
    sortOption,
    minRating,
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      <ProductSidebarFilter
        activeCategories={activeCategories}
        toggleCategory={toggleCategory}
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={initialCategories}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        inStockStatus={inStockStatus}
        setInStockStatus={setInStockStatus}
        minRating={minRating}
        setMinRating={setMinRating}
        clearFilters={clearFilters}
      />

      <div className="flex-1 flex flex-col">
        {/* Tab Toggle: Produk vs Kategori */}
        <CatalogTabs />

        <ProductSortBar
          onOpenFilter={() => setIsMobileFilterOpen(true)}
          count={products.length}
          currentSort={sortOption}
          onSortChange={setSortOption}
        />

        <div className="flex-1 mt-4">
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5 md:gap-2">
              {[...Array(8)].map((_, i) => (
                <ProductSkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[400px] bg-red-50 rounded-3xl border border-red-100 gap-2 p-6 text-center">
              <p className="font-bold text-red-600">{error}</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5 md:gap-2">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-10 mb-6">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-pink-200 text-pink-600 font-bold rounded-full hover:bg-pink-50 hover:border-pink-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loadingMore && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 gap-4">
              <PackageX className="w-12 h-12 text-stone-300" />
              <p className="text-stone-500 font-semibold">
                Tidak ada produk yang sesuai dengan filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * -------------------------------------------------------------------------
 * MAIN EXPORT
 * Wraps the catalog in Suspense so useSearchParams can safely be used
 * -------------------------------------------------------------------------
 */
export default function ProductCatalogClient({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-[400px] gap-4 w-full">
          <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
          <p className="text-sm font-semibold text-stone-500">
            Memuat katalog...
          </p>
        </div>
      }
    >
      <ProductCatalogContent initialCategories={initialCategories} />
    </Suspense>
  );
}
