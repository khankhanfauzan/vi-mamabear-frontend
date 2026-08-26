export type ViewMode = "grid" | "list";

export type AdminProductSortField = "name" | "price" | "createdAt" | "totalSold";

/**
 * Product Feature Types
 * Unified typing for the Product, Variants, Categories, and creation payload.
 */

export interface ProductFormValues {
  name: string;
  description: string;
  sku: string;
  categoryId: string;
  price: number;
  stock: number;
  weightG: number;
  isActive: string;
  metaTitle: string;
  metaDescription: string;
  ingredients: string;
  usageInstructions: string;
}

export interface ProductImage {
  id?: number;
  imageUrl?: string;
  publicId?: string;
  productId?: number | null;
  variantId?: number | null;
  reviewId?: number | null;
  categoryId?: number | null;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  altText?: string | null;
  sortOrder?: number | null;
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  priceIdr: string;
  weightG: number;
  sku: string;
  stock: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

export interface ProductHighlight {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  totalSold: number;
  categoryId: number;
  highlightId: number | null;
  tags: string[];
  description: string | null;
  ingredients: string | null;
  usageInstructions: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategory;
  highlight?: ProductHighlight;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CreateProductInput {
  name: string;
  isActive: boolean;
  totalSold?: number;
  categoryId: number;
  highlightId?: number | null;
  tags: string[];
  description: string | null;
  ingredients: string | null;
  usageInstructions: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  images?: ProductImage[];
  priceIdr: string;
  weightG: number;
  stock: number;
  sku?: string;
}

/**
 * Input format for creating a product variant
 */
export interface CreateVariantInput {
  productId: number;
  name: string;
  images: ProductImage[];
  priceIdr: number;
  weightG: number;
  sku: string;
  stock: number;
  sortOrder: number;
}

export interface ProductFilterParams {
  categories?: string[];
  minPrice?: number | string;
  maxPrice?: number | string;
  inStock?: boolean;
  priceAscending?: boolean;
  creationDateAscending?: boolean;
  popularAscending?: boolean;
  ratingAscending?: boolean;
  cursor?: string;
  limit?: number;
}
