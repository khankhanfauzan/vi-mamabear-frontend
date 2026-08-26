/**
 * Represents the category associated with a product.
 */
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents an image asset associated with a product.
 */
export interface ProductImage {
  id: number;
  publicId: string;
  productId: number | null;
  variantId: number | null;
  reviewId: number | null;
  categoryId: number | null;
  imageUrl: string;
  sortOrder: number;
  altText: string;
  width: number;
  height: number;
  fileSize: number;
  format: string;
}

/**
 * Represents a specific variant of a product (e.g., flavor, size).
 */
export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  priceIdr: string; // API returns numeric values as strings for precise currency representation
  weightG: number;
  sku: string;
  stock: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  images?: ProductImage[]; // Variant specific images
}

/**
 * Represents promotional highlight tags (e.g., "Recommended", "Best Seller").
 */
export interface ProductHighlight {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

/**
 * Represents the top review featured on the product detail page.
 */
export interface TopReview {
  id: number;
  title: string;
  reviewerId: string;
  productId: number;
  rating: number;
  numUpvotes: number;
  description: string;
  createdAt: string;
}

/**
 * Represents the complete product detail data payload.
 */
export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  totalSold: number;
  categoryId: number;
  highlightId: number;
  tags: string[]; // Assuming array of strings based on typical tag usage
  description: string;
  ingredients: string | null;
  usageInstructions: string | null;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
  highlight: ProductHighlight;
  currentPrice: string;
  originalPrice: string;
  discountPercent: number | string;
  rating: number;
  reviewsCount: number;
  topReview: TopReview;
  metaTitle: string | null;
  metaDescription: string | null;
}
