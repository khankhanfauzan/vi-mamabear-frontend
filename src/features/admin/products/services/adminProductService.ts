import {
  CreateProductInput,
  CreateVariantInput,
  Product,
  ProductFilterParams,
  ProductImage,
  ProductVariant,
} from "@/features/admin/products/types/product.types";
import { apiClient, fetchWrapper } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import { ApiResponse } from "@/types/api.types";
import { getSession } from "next-auth/react";
// Change this import path if your NextAuth authOptions is located elsewhere!
import { authOptions } from "@/lib/auth";

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
 * Resolves authentication headers dynamically depending on the current environment (Server or Client).
 * Extracts the NextAuth accessToken to send as a Bearer header to the external backend.
 */
async function getAuthHeaders(options: RequestInit = {}): Promise<Headers> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let token: string | undefined;

  // Check if we are running in the browser (Client)
  if (typeof window !== "undefined") {
    const session = await getSession();
    token = session?.accessToken;
  } else {
    // Server-Side: Extract token using NextAuth's getServerSession
    try {
      const { getServerSession } = await import("next-auth/next");
      const session = await getServerSession(authOptions);
      token = session?.accessToken;
    } catch (e) {
      console.warn(
        "[adminProductService] Server-side session resolution failed:",
        e,
      );
    }
  }

  // Attach the token as a Bearer header
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

/**
 * fetchProductById
 * Fetches a single product by its ID to pre-populate edit forms.
 */
export async function fetchProductById(id: number): Promise<Product> {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      cache: "no-store",
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const response: ApiResponse<Product> = await res.json();

    if (!response.success || !response.data) {
      throw new Error(response.message?.[0] || "Gagal mengambil data produk");
    }

    return response.data;
  } catch (error) {
    console.error(
      `[adminProductService] fetchProductById failed for ${id}:`,
      error,
    );
    throw error;
  }
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
    const headers = await getAuthHeaders();
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
    const url = `${API_BASE_URL}/admin/products/filter${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      headers,
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
 * uploadProductImages
 * Uploads product images using FormData and returns the uploaded image data.
 */
export async function uploadProductImages(
  formData: FormData,
): Promise<ProductImage | ProductImage[]> {
  try {
    const response = await fetchWrapper("/admin/upload/images", {
      method: "POST",
      body: formData,
    });

    const result: ApiResponse<ProductImage | ProductImage[]> =
      await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message?.[0] || "Gagal mengunggah gambar produk");
    }

    return result.data;
  } catch (error) {
    console.error("[adminProductService] uploadProductImages failed:", error);
    throw error;
  }
}

/**
 * createProduct
 * Creates a new product using the JSON payload.
 */
export async function createProduct(
  data: CreateProductInput,
): Promise<Product> {
  try {
    const response = await apiClient.post("/admin/products", data);
    const result: ApiResponse<Product> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message?.[0] || "Gagal membuat produk baru");
    }

    return result.data;
  } catch (error) {
    console.error("[adminProductService] createProduct failed:", error);
    throw error;
  }
}

/**
 * updateProduct
 * Updates an existing product.
 */
export async function updateProduct(
  productId: number,
  data: Partial<Product>,
): Promise<Product> {
  try {
    const response = await apiClient.put(`/admin/products/${productId}`, data);
    const result: ApiResponse<Product> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message?.[0] || "Gagal memperbarui produk");
    }

    return result.data;
  } catch (error) {
    console.error(
      `[adminProductService] updateProduct failed for ${productId}:`,
      error,
    );
    throw error;
  }
}

/**
 * deleteProduct
 * Removes a product.
 */
export async function deleteProduct(productId: number): Promise<boolean> {
  try {
    const response = await apiClient.delete(`/admin/products/${productId}`);
    const result: ApiResponse<null> = await response.json();

    if (!result.success) {
      throw new Error(result.message?.[0] || "Gagal menghapus produk");
    }

    return true;
  } catch (error) {
    console.error(
      `[adminProductService] deleteProduct failed for ${productId}:`,
      error,
    );
    throw error;
  }
}

/**
 * createProductVariant
 * Sends a POST request to add a new product variant for a specified product ID.
 */
export async function createProductVariant(
  productId: number,
  data: CreateVariantInput,
): Promise<ProductVariant> {
  try {
    const response = await apiClient.post(
      `/admin/products/${productId}/variants`,
      data,
    );
    const result: ApiResponse<ProductVariant> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.message?.[0] || "Gagal membuat varian produk baru",
      );
    }

    return result.data;
  } catch (error) {
    console.error(
      `[adminProductService] createProductVariant failed for ${productId}:`,
      error,
    );
    throw error;
  }
}

/**
 * updateProductVariant
 * Sends a PUT request to update an existing product variant by ID.
 */
export async function updateProductVariant(
  variantId: number,
  data: Partial<CreateVariantInput>,
): Promise<ProductVariant> {
  try {
    const response = await apiClient.put(
      `/admin/products/variants/${variantId}`,
      data,
    );
    const result: ApiResponse<ProductVariant> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message?.[0] || "Gagal memperbarui varian produk");
    }

    return result.data;
  } catch (error) {
    console.error(
      `[adminProductService] updateProductVariant failed for variant ${variantId}:`,
      error,
    );
    throw error;
  }
}

/**
 * deleteProductVariant
 * Sends a DELETE request to remove a product variant by ID.
 */
export async function deleteProductVariant(
  variantId: number,
): Promise<boolean> {
  try {
    const response = await apiClient.delete(
      `/admin/products/variants/${variantId}`,
    );
    const result: ApiResponse<null> = await response.json();

    if (!result.success) {
      throw new Error(result.message?.[0] || "Gagal menghapus varian produk");
    }

    return true;
  } catch (error) {
    console.error(
      `[adminProductService] deleteProductVariant failed for variant ${variantId}:`,
      error,
    );
    throw error;
  }
}

export const adminProductService = {
  fetchProductById,
  fetchFilteredProducts,
  uploadProductImages,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
};
