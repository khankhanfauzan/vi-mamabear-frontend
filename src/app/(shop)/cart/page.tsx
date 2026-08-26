import React from "react";
import { CartClientView } from "@/features/cart/components/CartClientView";

export const metadata = {
  title: "Keranjang Belanja | MamaBear",
  description: "Lihat dan kelola keranjang belanja produk MamaBear Anda.",
};

export default function CartPage() {
  return <CartClientView />;
}