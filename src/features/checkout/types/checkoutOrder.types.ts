/**
 * Standard Statuses for an Order in MamaBear
 */
export type OrderStatus =
  | "PAYMENT_PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

/**
 * Supported payment methods
 */
export type PaymentMethod = "BANK_TRANSFER" | "COD" | "CREDIT_CARD" | "E_WALLET";

/**
 * Request payload structure for creating a new order.
 * addressId is strictly a string as required by the backend on POST.
 */
export interface CreateOrderPayload {
  cartId: string;
  addressId: number; // Sent as a string to the BE order endpoint
  notes?: string;
}

/**
 * Represents an individual item bought within an order.
 */
export interface OrderItem {
  id: number;
  orderId: string;
  productId: number;
  variantId: number;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
}

/**
 * Shipping Address structure linked directly to the order.
 */
export interface OrderShippingAddress {
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
  detail: string | null;
  usedFor: string;
}

/**
 * Represents state changes of the order over time.
 */
export interface OrderStatusHistory {
  id: number;
  orderId: string;
  status: OrderStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Primary Order entity containing full order information.
 */
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  receivedExpiresAt: string | null;
  subtotalIdr: number;
  shippingCostIdr: number;
  taxIdr: number;
  shippingMethod: string;
  trackingNumber: string | null;
  paymentMethod: PaymentMethod | string;
  orderItems: OrderItem[];
  shippingAddress: OrderShippingAddress;
  statusHistory: OrderStatusHistory[];
}