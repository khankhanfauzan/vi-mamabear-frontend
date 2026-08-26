/**
 * Represents the image data returned within a cart product or variant.
 */
export interface CartImage {
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
 * Represents the simplified product data returned within a cart item.
 */
export interface CartProduct {
  id: number;
  name: string;
  isActive: boolean;
  images?: CartImage[];
}

/**
 * Represents the simplified variant data returned within a cart item.
 */
export interface CartVariant {
  id: number;
  name: string;
  priceIdr: string;
  stock: number;
  productId: number;
  weightG: number;
  images?: CartImage[];
}

/**
 * Represents an individual item inside the shopping cart.
 */
export interface CartItem {
  id: string;
  cartId: string;
  productId: number;
  variantId: number;
  quantity: number;
  price: string;
  createdAt: string;
  product: CartProduct;
  variant: CartVariant;
}

/**
 * Represents the shopping cart session for a user or guest.
 */
export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  subtotalIdr: number;
  taxIdr: number;
  shippingCostIdr: number;
  courierName: string | null;
  courierCode: string | null;
  shippingMethod: string | null;
  orderId: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  items: CartItem[];
  totalWeight: number;
}