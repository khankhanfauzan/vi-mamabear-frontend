import { useState, useEffect, useCallback } from "react";
import {
  fetchAdminProducts,
  AdminProductFilterParams,
} from "@/features/admin/products/services/adminListingProductService";
import type { AdminProductSortField } from "@/features/admin/products/types/product.types";
import { Product } from "@/features/products/types/products.types";

/**
 * useDebounce
 * Limits state changes triggered by fast keyboard entry.
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useAdminListingProducts
 * Core custom logic hook managing the fetching, filtering, searching,
 * page-based numbered pagination, and selection arrays.
 */
export function useAdminListingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStock, setInStock] = useState<string>("all");
  const [isActive, setIsActive] = useState<string>("all");

  // Combined sortBy and sortOrder for UI convenience
  const [sortBy, setSortBy] = useState<string>("createdAt-desc");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Numbered Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const resetFilters = useCallback(() => {
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setInStock("all");
    setIsActive("all");
    setSortBy("createdAt-desc");
    setPage(1); // Reset page on clear
  }, []);

  // Whenever a filter changes, reset the pagination to page 1
  useEffect(() => {
    setPage(1);
  }, [
    selectedCategory,
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
    inStock,
    isActive,
    sortBy,
  ]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    // Clear list to trigger skeleton loaders for numbered pagination
    setProducts([]);
    setSelectedProductIds([]);

    try {
      // Robustly parse and map the sortBy state to strictly allowed backend values
      let actualSortField: AdminProductSortField = "createdAt";
      let actualSortOrder: "asc" | "desc" = "desc";

      // Map legacy/old UI values just in case they are still used
      if (sortBy === "newest") {
        actualSortField = "createdAt";
        actualSortOrder = "desc";
      } else if (sortBy === "popular") {
        actualSortField = "totalSold";
        actualSortOrder = "desc";
      } else if (sortBy === "price_asc") {
        actualSortField = "price";
        actualSortOrder = "asc";
      } else if (sortBy === "price_desc") {
        actualSortField = "price";
        actualSortOrder = "desc";
      } else if (sortBy.includes("-")) {
        // Parse the new format (e.g., "name-asc", "createdAt-desc")
        const [field, order] = sortBy.split("-");
        const allowedFields: AdminProductSortField[] = [
          "name",
          "price",
          "createdAt",
          "totalSold",
        ];

        if (allowedFields.includes(field as AdminProductSortField)) {
          actualSortField = field as AdminProductSortField;
        }
        if (order === "asc" || order === "desc") {
          actualSortOrder = order;
        }
      }

      // Safe parameter building without using "any" explicit declarations
      const params: AdminProductFilterParams &
        Omit<
          Record<string, string | number | boolean>,
          keyof AdminProductFilterParams
        > = {
        limit: 20,
        page: page,
        similarityThreshold: 0.05,
        sortBy: actualSortField,
        sortOrder: actualSortOrder,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory !== "all") params.categoryId = selectedCategory;
      if (debouncedMinPrice) params.minPrice = debouncedMinPrice;
      if (debouncedMaxPrice) params.maxPrice = debouncedMaxPrice;
      if (inStock !== "all") params.inStock = inStock === "true";
      if (isActive !== "all") params.isActive = isActive === "true";

      const response = await fetchAdminProducts(params);

      if (response) {
        setProducts(response.data);
        setPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      }
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedCategory,
    debouncedSearch,
    debouncedMinPrice,
    debouncedMaxPrice,
    inStock,
    isActive,
    sortBy,
    page,
  ]);

  // Execute load whenever dependencies (including page) change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const refreshProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    inStock,
    setInStock,
    isActive,
    setIsActive,
    sortBy,
    setSortBy,
    showFilters,
    setShowFilters,
    page,
    totalPages,
    totalItems,
    handlePageChange,
    refreshProducts,
    resetFilters,
    selectedProductIds,
    setSelectedProductIds,
  };
}
