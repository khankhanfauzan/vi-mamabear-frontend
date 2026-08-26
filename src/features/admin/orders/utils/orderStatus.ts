import { OrderStatus } from "@/features/admin/orders/types/adminOrder.types";

/**
 * Human-readable labels for each order status
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PAYMENT_PENDING: "Menunggu Pembayaran",
  PAYMENT_PAID: "Pembayaran Berhasil",
  PAYMENT_FAILED: "Pembayaran Gagal",
  CONFIRMED: "Dikonfirmasi (MamaBear)",
  PROCESSED: "Sedang Diproses (Packing)",
  SENDING: "Sedang Dikirim (Kurir)",
  RECEIVED: "Pesanan Diterima",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  REFUNDED: "Dikembalikan (Dana)",
  RETURNED: "Dikembalikan (Barang)",
};

/**
 * Array of objects mapped for <select> dropdown options
 */
export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({
    value: value as OrderStatus,
    label,
  }),
);

/**
 * Fixed sequence for standard e-commerce successful flow
 * Used primarily for the order timeline component
 */
export const STATUS_SEQUENCE: { key: OrderStatus; label: string }[] = [
  { key: "PAYMENT_PENDING", label: ORDER_STATUS_LABELS.PAYMENT_PENDING },
  { key: "PAYMENT_PAID", label: ORDER_STATUS_LABELS.PAYMENT_PAID },
  { key: "CONFIRMED", label: ORDER_STATUS_LABELS.CONFIRMED },
  { key: "PROCESSED", label: ORDER_STATUS_LABELS.PROCESSED },
  { key: "SENDING", label: ORDER_STATUS_LABELS.SENDING },
  { key: "RECEIVED", label: ORDER_STATUS_LABELS.RECEIVED },
  { key: "COMPLETED", label: ORDER_STATUS_LABELS.COMPLETED },
];

/**
 * Grouping of all statuses that represent a failed, cancelled, or reversed order
 */
export const FAILED_STATUSES: OrderStatus[] = [
  "CANCELLED",
  "PAYMENT_FAILED",
  "REFUNDED",
  "RETURNED",
];
