import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchService } from "@/features/products/services/searchService";
import { Product } from "@/features/products/types/products.types";

export function useSearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await searchService.getProducts(query);
        if (response.success) {
          setProducts(response.data.data);
        } else {
          setError(response.message?.[0] || "Gagal memuat hasil pencarian.");
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Terjadi kesalahan saat mencari produk.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return {
    query,
    products,
    isLoading,
    error,
  };
}
