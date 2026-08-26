/**
 * Category Feature Types
 * Defines the structure of Category entities.
 */

export interface CategoryImage {
  id: number;
  publicId: string;
  productId: number | null;
  variantId: number | null;
  reviewId: number | null;
  categoryId: number | null;
  imageUrl: string;
  sortOrder: number;
  altText: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  format: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  metaTitle : string;
  metaDescription : string;
  images: CategoryImage[];
  _count : {
    products : number
  }
}
