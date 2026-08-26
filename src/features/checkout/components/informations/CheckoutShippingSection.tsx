import React from "react";
import { ShippingOption } from "@/features/address/types/shipping.types";

interface CheckoutShippingSectionProps {
  isLoadingCart: boolean;
  isCalculatingShipping: boolean;
  selectedAddressId: string | null;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;
  onSelectShipping: (index: number) => void;
  formatRupiah: (amount: number) => string;
}

export function CheckoutShippingSection({
  isLoadingCart,
  isCalculatingShipping,
  selectedAddressId,
  shippingOptions,
  selectedShipping,
  onSelectShipping,
  formatRupiah,
}: CheckoutShippingSectionProps) {
  const selectedIndex = shippingOptions.findIndex(
    (o) =>
      o.service === selectedShipping?.service &&
      o.code === selectedShipping?.code,
  );

  return (
    <section className="space-y-4">
      <h2 className="text-font-3 font-bold text-black">Opsi Pengiriman</h2>

      <div className="relative">
        <select
          className="w-full border border-[var(--mama-hot-pink)] rounded-lg px-4 py-4 text-font-2 text-[var(--mama-brown)] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] bg-white disabled:bg-gray-50 disabled:border-gray-300 cursor-pointer"
          disabled={
            isLoadingCart ||
            isCalculatingShipping ||
            !selectedAddressId ||
            shippingOptions.length === 0
          }
          value={selectedIndex >= 0 ? selectedIndex : ""}
          onChange={(e) => onSelectShipping(Number(e.target.value))}
        >
          {isCalculatingShipping ? (
            <option value="">Menghitung ongkos kirim...</option>
          ) : shippingOptions.length === 0 ? (
            <option value="">Pilih alamat pengiriman terlebih dahulu</option>
          ) : (
            shippingOptions.map((opt, idx) => (
              <option key={`${opt.code}-${opt.service}`} value={idx}>
                {opt.code.toUpperCase()} - {opt.service} (
                {formatRupiah(opt.cost)})
              </option>
            ))
          )}
        </select>

        {/* Fake dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-[var(--mama-brown)] text-sm">▼</span>
        </div>
      </div>
    </section>
  );
}
