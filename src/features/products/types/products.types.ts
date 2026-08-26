import { Category } from "@/features/categories/types/category.types";

export type ViewMode = "grid" | "list";

export interface ProductImage {
  id: number;
  productId: number;
  publicId: string;
  variantId: number | null;
  imageUrl: string;
  sortOrder: number;
  altText: string;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  format: string | null;
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  priceIdr: string; // Stored as string in JSON (e.g., "80000")
  weightG: number;
  sku: string;
  stock: number;
  sortOrder: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface Highlight {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  categoryId: number;
  highlightId: number;
  tags: string[];
  description: string;
  ingredients: string | null;
  usageInstructions: string | null;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  metaTitle: string | null;
  metaDescription: string | null;

  // Rich relational payloads
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  highlight?: Highlight | null;

  // New Analytical and dynamic pricing fields
  currentPrice?: string; // Computed current price (string from backend)
  originalPrice?: string; // Base price before discount
  discountPercent?: number; // Computed discount percent represented as a string
  rating?: number; // Average user rating
  reviewsCount?: number; // Total review count
  totalSold?: number;
}

/**
 * Filter parameters for the /api/products/filter endpoint.
 * Supports multiple categories, price ranges, stock status, sorting, and cursor pagination.
 */
export interface ProductFilterParams {
  categories?: string[];
  minPrice?: number | string;
  maxPrice?: number | string;
  inStock?: boolean;
  minRating?: number;
  priceAscending?: number;
  creationDateAscending?: number;
  popularAscending?: number;
  ratingAscending?: number;
  cursor?: string;
  limit?: number;
}

export interface CategoryItem {
  name: string;
  slug: string;
}

export interface PaginationMeta {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface PaginatedProducts {
  success: boolean;
  data: Product[];
  pagination: PaginationMeta;
}
