import { PaginatedProducts } from "@/features/products/types/products.types";
import { SearchSuggestion } from "@/features/products/types/search.types";
import { API_BASE_URL } from "@/lib/config";
import { ApiResponse } from "@/types/api.types";

export const searchService = {
  /**
   * Fetches product search results based on a query string.
   * @param query The search term
   * @returns Promise containing the API response with an array of Product
   */
  async getProducts(query: string): Promise<ApiResponse<PaginatedProducts>> {
    // if (!query.trim()) {
    //   return { success: true, data: [] };
    // }

    const response = await fetch(
      `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Cache strategy can be adjusted depending on your Next.js caching needs
        // cache: 'no-store'
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch product search results");
    }

    return response.json();
  },

  /**
   * Fetches search suggestions (autocomplete/fuzzy search) based on a query string.
   * @param query The search term
   * @returns Promise containing the API response with an array of SearchSuggestion
   */
  async getSuggestions(
    query: string,
  ): Promise<ApiResponse<SearchSuggestion[]>> {
    // if (!query.trim()) {
    //   return { success: true, data: [] };
    // }

    const response = await fetch(
      `${API_BASE_URL}/products/search/suggestions?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch search suggestions");
    }

    return response.json();
  },
};
