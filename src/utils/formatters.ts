export const formatIDR = (amount: number | string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(Number(amount));
};
