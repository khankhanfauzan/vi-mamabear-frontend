/**
 * Formats a string or numeric price into Indonesian Rupiah (IDR) format.
 * Matches user requirements for local Indonesian currency displays.
 */
export const formatIDR = (price?: string): string => {
  if (!price) return "Rp 0";
  const numericPrice = parseInt(price, 10);
  if (isNaN(numericPrice)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};