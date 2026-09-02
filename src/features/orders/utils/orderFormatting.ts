/**
 * Utility functions for formatting order data and UI elements based on status.
 */

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  // Replaces the comma with bullet point to match UI: "14 May 2026 • 14:00"
  return formatter.format(date).replace(",", " •");
};

/**
 * Normalizes backend / Midtrans / legacy status strings into the canonical enum key.
 * e.g. "pending", "payment-pending" → "PAYMENT_PENDING"
 */
const normalizeOrderStatus = (status: string): string => {
  const normalized = status.trim().toUpperCase().replace(/[\s-]+/g, "_");
  const aliases: Record<string, string> = {
    PENDING: "PAYMENT_PENDING",
    PAID: "PAYMENT_PAID",
    PROCESSING: "PROCESSED",
    SHIPPED: "SENDING",
    DELIVERED: "RECEIVED",
    CANCELED: "CANCELLED",
  };
  return aliases[normalized] ?? normalized;
};

/**
 * Returns Tailwind classes and labels based on the new backend OrderStatus enum.
 */
export const getStatusConfig = (status: string) => {
  switch (normalizeOrderStatus(status)) {
    case "PAYMENT_PENDING":
      return { 
        label: "Menunggu Pembayaran", 
        badge: "bg-red-600 text-white", 
        footer: "bg-red-600 text-white" 
      };
    case "PAYMENT_PAID":
      return { 
        label: "Sudah Dibayar", 
        badge: "bg-orange-500 text-white", 
        footer: "bg-orange-500 text-white" 
      };
    case "CONFIRMED":
      return { 
        label: "Dikonfirmasi", 
        badge: "bg-[var(--mama-pink)] text-[var(--mama-brown)]", 
        footer: "bg-[#e89eb8] text-[var(--mama-brown)]" 
      };
    case "PROCESSED":
      return { 
        label: "Diproses", 
        badge: "bg-[var(--mama-pink)] text-[var(--mama-brown)]", 
        footer: "bg-[#e89eb8] text-[var(--mama-brown)]" 
      };
    case "SENDING":
      return { 
        label: "Dikirim", 
        badge: "bg-[var(--mama-pink)] text-[var(--mama-brown)]", 
        footer: "bg-[#e89eb8] text-[var(--mama-brown)]" 
      };
    case "RECEIVED":
      return { 
        label: "Diterima", 
        badge: "bg-[var(--mama-brown)] text-white", 
        footer: "bg-[var(--mama-brown)] text-white" 
      };
    case "COMPLETED":
      return { 
        label: "Selesai", 
        badge: "bg-[var(--mama-brown)] text-white", 
        footer: "bg-[var(--mama-brown)] text-white" 
      };
    case "CANCELLED":
      return { 
        label: "Dibatalkan", 
        badge: "bg-[var(--color-gray)] text-white", 
        footer: "bg-[var(--color-gray)] text-white" 
      };
    case "REFUNDED":
      return { 
        label: "Dikembalikan", 
        badge: "bg-[var(--color-gray)] text-white", 
        footer: "bg-[var(--color-gray)] text-white" 
      };
    default:
      return { 
        label: status, 
        badge: "bg-gray-200 text-gray-800", 
        footer: "bg-gray-200 text-gray-800" 
      };
  }
};