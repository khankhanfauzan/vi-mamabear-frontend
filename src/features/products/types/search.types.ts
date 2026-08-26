/**
 * Represents the simplified product data returned by the search endpoint.
 * Omit removes the heavy nested relations that aren't included in this specific payload.
 */
// export type SearchProduct = Omit<Product, "category" | "images" | "variants">;

export interface SearchSuggestion {
  name: string;
  similarity: number; // Decimal score returned by the fuzzy search matcher
}
