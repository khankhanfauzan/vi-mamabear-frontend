import { Product, ProductFilterParams } from "@/features/products/types/products.types";
import { API_BASE_URL } from "@/lib/config";
import { ApiResponse } from "@/types/api.types";
import { apiClient } from "@/lib/api";

/**
 * Updated Pagination metadata structure for page-based pagination.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
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
 * Parameters specifically for the Admin Product endpoint
 */
export interface AdminProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  similarityThreshold?: number;
  categoryId?: string | number;
  isActive?: boolean;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  sortBy?: "name" | "price" | "createdAt" | "totalSold";
  sortOrder?: "asc" | "desc";
}

/**
 * fetchAdminProducts
 * Fetches products for the admin panel using the dedicated page-based endpoint.
 */
export async function fetchAdminProducts(
  params: AdminProductFilterParams = {}
): Promise<PaginatedProducts> {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.similarityThreshold !== undefined) searchParams.append("similarityThreshold", params.similarityThreshold.toString());

    if (params.categoryId) searchParams.append("categoryId", params.categoryId.toString());
    if (params.isActive !== undefined) searchParams.append("isActive", params.isActive.toString());

    if (params.minPrice) searchParams.append("minPrice", params.minPrice);
    if (params.maxPrice) searchParams.append("maxPrice", params.maxPrice);
    if (params.inStock !== undefined) searchParams.append("inStock", params.inStock.toString());

    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    // Using apiClient.get to access the dedicated admin endpoint
    const res = await apiClient.get(`/admin/products?${searchParams.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} - Failed to fetch admin products`);
    }

    const response: ApiResponse<PaginatedProducts> = await res.json();
    
    // Validate nested success structure
    if (!response.success || !response.data) {
      throw new Error(response.message || "API returned an error while fetching admin products");
    }
    
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unknown error occurred");
  }
}

/**
 * fetchFilteredProducts
 * Keeps existing functionality for public-facing storefront filtering (if needed).
 */
export async function fetchFilteredProducts(
  params: ProductFilterParams = {},
): Promise<PaginatedProducts> {
  try {
    const searchParams = new URLSearchParams();

    if (params.categories && params.categories.length > 0) {
      params.categories.forEach((cat) => searchParams.append("categories", cat));
    }
    if (params.minPrice !== undefined && params.minPrice !== "")
      searchParams.append("minPrice", params.minPrice.toString());

    const res = await fetch(`${API_BASE_URL}/products?${searchParams.toString()}`);

    if (!res.ok) throw new Error(`HTTP Error: ${res.status} - Failed to fetch products`);

    const response: ApiResponse<PaginatedProducts> = await res.json();
    if (!response.success || !response.data) throw new Error("API error");
    
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unknown error occurred");
  }
}

/**
 * getProductBySlug
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const response: ApiResponse<Product> = await res.json();
    if (!response.success || !response.data) throw new Error("API error");
    
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

/**
 * updateProduct
 */
export async function updateProduct(
  productId: number,
  data: Partial<Product>
): Promise<Product> {
  try {
    const res = await apiClient.put(`/admin/products/${productId}`, data);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const response: ApiResponse<Product> = await res.json();
    if (!response.success || !response.data) throw new Error("API error");
    
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

/**
 * deleteProduct
 */
export async function deleteProduct(productId: number): Promise<boolean> {
  try {
    const res = await apiClient.delete(`/admin/products/${productId}`);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const response: ApiResponse<null> = await res.json();
    if (!response.success) throw new Error("API error");
    
    return response.success;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error");
  }
}

/**
 * duplicateProduct
 * Creates a duplicate of an existing product via POST request.
 */
export async function duplicateProduct(productId: number): Promise<Product> {
  try {
    const res = await apiClient.post(`/admin/products/${productId}/duplicate`, {});

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} - Failed to duplicate product`);
    }

    const response: ApiResponse<Product> = await res.json();
    if (!response.success || !response.data) {
      throw new Error(response.message || "API returned an error while duplicating the product");
    }

    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unknown error occurred during duplication");
  }
}

/**
 * exportProductsCsv
 * Fetches and returns the generated CSV export stream as a file blob.
 */
export async function exportProductsCsv(): Promise<Blob> {
  try {
    const res = await apiClient.get("/admin/products/export");

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} - Failed to export CSV file`);
    }

    return await res.blob();
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unknown error occurred during CSV export");
  }
}

/**
 * bulkDeleteProducts
 * Performs a single request to batch delete multiple products.
 */
export async function bulkDeleteProducts(ids: number[]): Promise<boolean> {
  try {
    const res = await apiClient.delete("/admin/products/bulk-delete", {
      body: JSON.stringify({ ids }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} - Failed to bulk delete products`);
    }

    const response: ApiResponse<null> = await res.json();
    if (!response.success) {
      throw new Error(response.message || "API returned an error during bulk deletion");
    }

    return response.success;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unknown error occurred");
  }
}

/**
 * bulkUpdateProductsStatus
 * Performs a single PATCH request to batch publish/draft multiple products.
 */
export async function bulkUpdateProductsStatus(ids: number[], isActive: boolean): Promise<boolean> {
  try {
    const res = await apiClient.patch("/admin/products/bulk-publish", { ids, isActive });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} - Failed to bulk update products status`);
    }

    const response: ApiResponse<null> = await res.json();
    if (!response.success) {
      throw new Error(response.message || "API returned an error during bulk status update");
    }

    return response.success;
  } catch (error) {
    throw error instanceof Error ? error : new Error("An unknown error occurred");
  }
}