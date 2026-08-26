"use client";

import { useState, useEffect } from "react";
import { Category } from "@/features/categories/types/category.types";
import { categoryService } from "@/features/categories/services/categoryService";

export interface GroupedCategories {
  terbaru: Category[];
  minuman: Category[];
}

/**
 * Custom hook to manage category fetching and presentation logic.
 * Artificially groups the flat category data to match the UI layout requirements.
 */
export function useCategories(initialData?: Category[]) {
  const [categories, setCategories] = useState<Category[]>(initialData || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip client fetch if we already have server-provided initial data
    if (initialData && initialData.length > 0) return;

    let isMounted = true;

    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await categoryService.fetchCategories();
        if (isMounted) setCategories(data);
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Gagal memuat kategori");
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  return {
    categories,
    isLoading,
    error,
  };
}
