/**
 * Standard Statuses for an Order in MamaBear
 * Updated based on the latest backend schema.
 */
export type OrderStatus =
  | "PAYMENT_PENDING" // for midtrans pending
  | "PAYMENT_PAID"    // for midtrans success
  | "CONFIRMED"       // confirmed payment by mamabear 
  | "PROCESSED"       // mamabear process order: packing and assigning courier
  | "SENDING"         // courier transporting order
  | "RECEIVED"        // order received by customer
  | "COMPLETED"       // order fully completed
  | "CANCELLED"       // order cancelled
  | "REFUNDED";       // order refunded

/**
 * Supported payment methods
 */
export type PaymentMethod = "BANK_TRANSFER" | "COD" | "CREDIT_CARD" | "E_WALLET";

/**
 * Request payload structure for creating a new order.
 */
export interface CreateOrderPayload {
  addressId: number;
  paymentMethod: PaymentMethod | string;
  courierCode: string; // e.g. "JNE"
  courierService: string; // e.g. "REG"
  shippingCostIdr: number;
  notes?: string;
}

export interface OrderItemProduct {
  name: string;
  slug: string;
}

export interface OrderItemVariantImage {
  imageUrl: string;
  altText: string;
}

export interface OrderItemVariant {
  name: string;
  stock?: number;
  priceIdr: string | number;
  images: OrderItemVariantImage[];
}

/**
 * Represents an individual item bought within an order.
 */
export interface OrderItem {
  id: string | number;
  orderId: string;
  productId: number;
  variantId: number;
  quantity: number;
  price: string | number;
  createdAt?: string;
  productName?: string;
  variantName?: string;
  product?: OrderItemProduct;
  variant?: OrderItemVariant;
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
  orderNumber?: string;
  userId: string;
  status: OrderStatus;
  receivedExpiresAt: string | null;
  subtotalIdr: number;
  taxIdr: number;
  shippingCostIdr: number;
  courierName: string;
  courierCode: string;
  shippingMethod: string;
  paymentRedirectUrl?: string | null;
  trackingNumber: string | null;
  paymentMethod: PaymentMethod | string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  shippingAddress: OrderShippingAddress;
  orderStatusHistory?: OrderStatusHistory[];
  grandTotalIdr?: number;
}

/**
 * Pagination metadata for paginated API responses
 */
export interface PaginationMeta {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

/**
 * Represents the paginated response structure specifically for getting orders
 */
export interface PaginatedOrders {
  success: boolean;
  data: Order[];
  pagination: PaginationMeta;
}

export interface InvoiceOrderedItem {
  productName: string;
  variantName: string;
  quantity: number;
  price: string | number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issuedAt: string;
  OrderedItem: InvoiceOrderedItem[];
  ShippingAddress: string;
  subtotalIdr: string | number;
  shippingCostIdr: string | number;
  totalIdr: string | number;
  PaymentMethod: string;
  InvoicePaymentStatus: string;
}