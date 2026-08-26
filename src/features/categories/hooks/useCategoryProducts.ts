"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Product,
  ProductFilterParams,
} from "@/features/products/types/products.types";
import { fetchFilteredProducts } from "@/features/products/services/productsService";

export function useCategoryProducts(categorySlug: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingNext, setIsFetchingNext] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const fetchProducts = useCallback(
    async (cursor?: string) => {
      try {
        const params: ProductFilterParams = {
          categories: [categorySlug],
          limit: 12,
          cursor: cursor,
        };

        const res = await fetchFilteredProducts(params);

        if (res && res.success) {
          if (cursor) {
            setProducts((prev) => [...prev, ...res.data]);
          } else {
            setProducts(res.data);
          }
          setNextCursor(res.pagination.nextCursor);
          setHasNextPage(res.pagination.hasNextPage);
        } else {
          throw new Error("Format respons tidak valid");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Gagal memuat produk");
        }
      }
    },
    [categorySlug],
  );

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchProducts().finally(() => setIsLoading(false));
  }, [fetchProducts]);

  // Load more handler
  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNext || !nextCursor) return;

    setIsFetchingNext(true);
    fetchProducts(nextCursor).finally(() => setIsFetchingNext(false));
  }, [fetchProducts, hasNextPage, isFetchingNext, nextCursor]);

  return {
    products,
    isLoading,
    isFetchingNext,
    error,
    hasNextPage,
    loadMore,
  };
}
