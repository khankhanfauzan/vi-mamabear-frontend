import {
  Product,
  ProductFilterParams,
} from "@/features/products/types/products.types";
import { API_BASE_URL } from "@/lib/config";
import { ApiResponse } from "@/types/api.types";

/**
 * Pagination metadata structure returned by the backend.
 */
export interface PaginationMeta {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

/**
 * Response structure for the paginated product list.
 */
export interface PaginatedProducts {
  success: boolean;
  data: Product[];
  pagination: PaginationMeta;
}
/**
 * fetchFilteredProducts
 * Fetches a list of products using the advanced filtering and cursor pagination endpoint.
 * @param params - The filter, sorting, and pagination parameters
 * @returns Promise resolving to a PaginatedProducts object or null on failure
 */
export async function fetchFilteredProducts(
  params: ProductFilterParams = {},
): Promise<PaginatedProducts | null> {
  try {
    const searchParams = new URLSearchParams();

    // Handle array of category slugs
    if (params.categories && params.categories.length > 0) {
      params.categories.forEach((cat) =>
        searchParams.append("categories", cat),
      );
    }

    // Handle optional filters and sorting
    if (params.minPrice !== undefined && params.minPrice !== "")
      searchParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined && params.maxPrice !== "")
      searchParams.append("maxPrice", params.maxPrice.toString());
    if (params.inStock !== undefined)
      searchParams.append("inStock", params.inStock.toString());
    if (params.priceAscending !== undefined)
      searchParams.append("priceAscending", params.priceAscending.toString());
    if (params.creationDateAscending !== undefined)
      searchParams.append(
        "creationDateAscending",
        params.creationDateAscending.toString(),
      );
    if (params.popularAscending !== undefined)
      searchParams.append(
        "popularAscending",
        params.popularAscending.toString(),
      );
    if (params.ratingAscending !== undefined)
      searchParams.append("ratingAscending", params.ratingAscending.toString());

    // Handle pagination
    if (params.cursor) searchParams.append("cursor", params.cursor);
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/products/filter${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[productService] HTTP Error: ${res.status}`);
      return null;
    }

    const response: ApiResponse<PaginatedProducts> = await res.json();

    if (!response.success) {
      console.error(`[productService] API Error: ${response.message}`);
      throw new Error(
        response.message || "API returned an error while fetching products",
      );
    }

    return response.data;
  } catch (error) {
    console.error("[productService] fetchFilteredProducts failed:", error);
    throw error instanceof Error
      ? error
      : new Error("An unknown error occurred");
  }
}

/**
 * getProductBySlug
 * Fetches a single product's detailed information by its unique slug.
 * Essential for the Product Detail Page (PDP).
 * @param slug - The string slug of the product
 * @returns Promise resolving to a Product object or null if not found
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `HTTP Error: ${res.status} - Failed to fetch product details`,
      );
    }

    const response: ApiResponse<Product> = await res.json();

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "API returned an error while updating the product",
      );
    }

    return response.data;
  } catch (error) {
    console.error("[productService] getProductBySlug failed:", error);
    throw error instanceof Error
      ? error
      : new Error("An unknown error occurred");
  }
}

/**
 * Exporting as an object pattern to allow 'productService.fetchFilteredProducts'
 * usage if preferred elsewhere in the app.
 */
export const productService = {
  fetchFilteredProducts,
  getProductBySlug,
};
