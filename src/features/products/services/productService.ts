import { ApiResponse } from "@/types/api.types";
import { ProductDetail, ProductVariant } from "../types/product.types";
import { API_BASE_URL } from "@/lib/config";
import { Product } from "@/features/products/types/products.types";

/**
 * Service layer for interacting with Product endpoints.
 * Utilizes native fetch and casts responses to manually defined types.
 */
export const productService = {
  /**
   * Fetches detailed information for a specific product by its slug.
   * * @param slug - The unique slug of the product.
   * @param options - Additional Next.js fetch options (e.g., { next: { revalidate: 60 } }).
   */
  async getProductBySlug(
    slug: string,
    options?: RequestInit,
  ): Promise<ProductDetail> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal mengambil detail produk: HTTP ${res.status}`);
      }

      const response: ApiResponse<ProductDetail> = await res.json();

      if (!response.success) {
        throw new Error(response.message || "Gagal mengambil detail produk");
      }

      return response.data;
    } catch (error) {
      console.error(
        `[productService] getProductBySlug failed for ${slug}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Fetches related products based on a product slug.
   * * @param slug - The unique slug of the target product.
   * @param options - Additional Next.js fetch options.
   */
  async getRelatedProducts(
    slug: string,
    options?: RequestInit,
  ): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${slug}/related`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal mengambil produk terkait: HTTP ${res.status}`);
      }

      const response: ApiResponse<Product[]> = await res.json();

      if (!response.success) {
        throw new Error(response.message || "Gagal mengambil produk terkait");
      }

      return response.data || [];
    } catch (error) {
      console.error(
        `[productService] getRelatedProducts failed for ${slug}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Fetches all variants for a specific product.
   * * @param slug - The unique slug of the product.
   * @param options - Additional Next.js fetch options.
   */
  async getProductVariants(
    slug: string,
    options?: RequestInit,
  ): Promise<ProductVariant[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${slug}/variants`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal mengambil varian produk: HTTP ${res.status}`);
      }

      const response: ApiResponse<ProductVariant[]> = await res.json();

      if (!response.success) {
        throw new Error(response.message || "Gagal mengambil varian produk");
      }

      return response.data || [];
    } catch (error) {
      console.error(
        `[productService] getProductVariants failed for ${slug}:`,
        error,
      );
      throw error;
    }
  },
};
