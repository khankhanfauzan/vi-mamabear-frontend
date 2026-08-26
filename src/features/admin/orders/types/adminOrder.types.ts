/**
 * Defines the possible statuses for an order.
 * Kept as a union type for strict checking, with a fallback to string 
 * in case the backend introduces new statuses before the frontend updates.
 */
export type OrderStatus = 
  | 'PAYMENT_PENDING' // for midtrans pending
  | 'PAYMENT_PAID' // for midtrans success
  | 'PAYMENT_FAILED' // for midtrans failed
  | 'CONFIRMED' // confirmed payment by mamabear 
  | 'PROCESSED' // mamabear process order: packing and assigning courier
  | 'SENDING' // courier transporting order
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RETURNED'
  | string;

/**
 * Core Order entity based on the backend response.
 */
export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  receivedExpiresAt: string | null;
  notes: string | null;
  subtotalIdr: number;
  taxIdr: number;
  shippingCostIdr: number;
  courierName: string | null;
  courierCode: string | null;
  shippingMethod: string | null;
  trackingNumber: string | null;
  paymentMethod: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface OrderProductImage {
  imageUrl: string;
  altText: string;
}

export interface OrderProduct {
  id: number;
  name: string;
  slug: string;
  images: OrderProductImage[];
}

export interface OrderVariant {
  id: number;
  name: string;
  priceIdr: string;
  stock: number;
  sku: string;
  weightG: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: number;
  variantId: number;
  quantity: number;
  price: string;
  createdAt: string;
  product: OrderProduct;
  variant: OrderVariant;
}

export interface ShippingAddress {
  id: number;
  orderId: string;
  name: string;
  phone: string;
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  subdistrictId: number;
  subdistrictName: string;
  postalCode: string;
  road: string;
  completeAddress: string;
  detail: string;
  usedFor: string;
}

export interface OrderHistoryItem {
  id: number;
  orderId: string;
  status: OrderStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Detailed Order entity, typically returned by the 'get by ID' endpoint,
 * which includes relations like user, items, and shipping address.
 */
export interface OrderDetail extends Order {
  user: OrderUser;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  orderStatusHistory: OrderHistoryItem[];
}


/**
 * Data Transfer Objects (DTOs) for Admin Order Mutations
 */
export interface UpdateOrderStatusDto {
  status: OrderStatus;
  trackingNumber?: string;
  shippingMethod?: string;
  notes?: string;
}

export interface UpdateTrackingDto {
  trackingNumber: string;
  courierCode?: string;
  courierName?: string;
  shippingMethod?: string;
}

export interface CancelOrderDto {
  notes?: string;
}

export interface InvoiceResponse {
  invoiceUrl: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Maps to the nested data object inside the main ApiResponse
 */
export interface PaginatedOrders {
  success: boolean;
  data: OrderDetail[];
  pagination: PaginationMeta;
}