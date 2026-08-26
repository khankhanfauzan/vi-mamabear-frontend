import { Category } from "@/features/categories/types/category.types";
import { apiClient } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import { ApiResponse } from "@/types/api.types";

/**
 * Category Service
 * Handles API communication for categories using the strictly typed
 * Category interface defined in product.types.ts.
 */

/**
 * fetchCategories
 * Fetches the full list of categories from the /api/categories endpoint.
 * @returns Promise resolving to an array of Category objects
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      // or use 'force-cache' / 'next: { revalidate }' for better performance if they are mostly static.
      // next: { revalidate: 86400 },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil kategori: HTTP ${res.status}`);
    }

    const response: ApiResponse<Category[]> = await res.json();

    if (!response.success) {
      throw new Error(response.message || "Gagal mengambil daftar kategori");
    }

    return response.data || [];
  } catch (error) {
    console.error("[categoryService] fetchCategories failed:", error);
    throw error;
  }
}

/**
 * getCategoryBySlug
 * Fetches a single category's detailed information by its unique slug.
 * @param slug - The string slug of the category
 * @returns Promise resolving to a Category object or null if not found
 */
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null; // Gracefully handle 404 Not Found
      throw new Error(`Gagal mengambil detail kategori: HTTP ${res.status}`);
    }

    const response: ApiResponse<Category> = await res.json();

    if (!response.success) {
      throw new Error(response.message || "Gagal mengambil detail kategori");
    }

    return response.data || null;
  } catch (error) {
    console.error("[categoryService] getCategoryBySlug failed:", error);
    throw error;
  }
}

/**
 * createCategory
 * Creates a new category.
 */
export async function createCategory(
  categoryData: Partial<Category>,
): Promise<Category> {
  try {
    const response = await apiClient.post(`/admin/categories`, categoryData);
    const result: ApiResponse<Category> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Gagal membuat kategori");
    }

    return result.data;
  } catch (error) {
    console.error(`[categoryService] createCategory failed:`, error);
    throw error;
  }
}

export async function uploadCategoryImage(img:File){
  try {
    const formData = new FormData()
    formData.append("image", img)

    const response = await apiClient.postImage(`/admin/upload/image`, formData);
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Gagal membuat kategori");
    }

    return result.data;
  } catch (error) {
    console.error(`[categoryService] createCategory failed:`, error);
    throw error;
  }
}

/**
 * updateCategory
 * Updates an existing category by its ID.
 */
export async function updateCategory(
  id: number,
  categoryData: Partial<Category>,
): Promise<Category> {
  try {
    const response = await apiClient.put(
      `/admin/categories/${id}`,
      categoryData,
    );
    const result: ApiResponse<Category> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Gagal memperbarui kategori");
    }

    return result.data;
  } catch (error) {
    console.error(`[categoryService] updateCategory failed for ${id}:`, error);
    throw error;
  }
}

/**
 * deleteCategory
 * Deletes an existing category by its ID.
 */
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    const result: ApiResponse<null> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Gagal menghapus kategori");
    }

    return true;
  } catch (error) {
    console.error(`[categoryService] deleteCategory failed for ${id}:`, error);
    throw error;
  }
}

export const adminCategoryService = {
  fetchCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
