"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Address } from "@/features/address/types/address.types";
import { useCheckout } from "@/features/checkout/hooks/useCheckout";
import { CheckoutStepper } from "@/features/checkout/components/shared/CheckoutStepper";

interface CheckoutViewProps {
  initialAddresses: Address[];
  userEmail: string;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export function CheckoutView({
  initialAddresses,
  userEmail,
}: CheckoutViewProps) {
  const {
    addresses,
    cart,
    isLoadingCart,
    selectedAddressId,
    shippingOptions,
    selectedShipping,
    isCalculatingShipping,
    isSubmitting,
    errorMessage,
    totals,
    notes,
    actions,
  } = useCheckout(initialAddresses, userEmail);

  // Handle empty cart screen
  if (!isLoadingCart && (!cart || cart?.items?.length === 0)) {
    return (
      <div className="text-center py-20 text-gray-500 max-w-md mx-auto">
        <p className="mb-4">
          Keranjang Anda kosong. Silakan belanja terlebih dahulu.
        </p>
        <Link
          href="/products"
          className="inline-block bg-[var(--mama-hot-pink)] hover:bg-[#c24467] text-white font-bold py-3 px-6 rounded-full transition-colors text-font-2"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-font-5 font-bold text-black mb-8">Check Out</h1>

      <CheckoutStepper activeStep={1} />

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-font-2">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Data Pengiriman */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Address Section */}
          <section className="space-y-4">
            <h2 className="text-font-3 font-bold text-[var(--mama-brown)]">
              Dikirim ke
            </h2>

            <div className="space-y-4">
              {addresses.map((address) => {
                const isSelected = selectedAddressId === String(address.id);
                return (
                  <div
                    key={address.id}
                    onClick={() =>
                      actions.handleSelectAddress(String(address.id))
                    }
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-colors relative bg-white ${
                      isSelected
                        ? "border-[var(--mama-hot-pink)]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin
                          className="text-[var(--mama-brown)]"
                          size={20}
                        />
                        <h3 className="font-bold text-[var(--mama-brown)] text-font-2">
                          {address.usedFor} {address.name}
                        </h3>
                      </div>
                      <Link
                        href={`/account/addresses`}
                        className="text-gray-400 hover:text-[var(--mama-brown)] text-sm font-medium"
                      >
                        Ubah
                      </Link>
                    </div>
                    <div className="pl-7 space-y-1">
                      <p className="text-[var(--mama-brown)] font-bold text-font-1">
                        {address.phone}
                      </p>
                      <div className="text-gray-600 text-font-1 leading-relaxed mt-2">
                        <p>
                          {address.road}{" "}
                          {address.detail && `(${address.detail})`}
                        </p>
                        <p>
                          Kec. {address.districtName}, Kel.{" "}
                          {address.subdistrictName}
                        </p>
                        <p>
                          {address.cityName}, {address.provinceName}
                        </p>
                        <p>{address.postalCode}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/account/addresses/new"
              className="block w-full text-center bg-[var(--mama-pink)] hover:bg-[#f5b8c9] text-[var(--mama-brown)] font-bold py-3 px-4 rounded-full transition-colors text-font-2"
            >
              + Alamat baru
            </Link>
          </section>

          {/* Shipping Options Section */}
          <section className="space-y-4">
            <h2 className="text-font-3 font-bold text-black">
              Opsi Pengiriman
            </h2>

            <div className="relative">
              <select
                className="w-full border border-[var(--mama-hot-pink)] rounded-lg px-4 py-4 text-font-2 text-[var(--mama-brown)] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] bg-white disabled:bg-gray-50 disabled:border-gray-300 cursor-pointer"
                disabled={
                  isLoadingCart ||
                  isCalculatingShipping ||
                  !selectedAddressId ||
                  shippingOptions.length === 0
                }
                value={shippingOptions.findIndex(
                  (o) =>
                    o.service === selectedShipping?.service &&
                    o.code === selectedShipping?.code,
                )}
                onChange={(e) =>
                  actions.handleSelectShipping(Number(e.target.value))
                }
              >
                {isCalculatingShipping ? (
                  <option>Menghitung ongkos kirim...</option>
                ) : shippingOptions.length === 0 ? (
                  <option>Pilih alamat pengiriman terlebih dahulu</option>
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

          {/* Notes Section */}
          <section className="space-y-4">
            <h2 className="text-font-3 font-bold text-black">
              Catatan Pesanan
            </h2>
            <textarea
              className="w-full border border-[var(--mama-hot-pink)] rounded-lg px-4 py-4 text-font-2 text-[var(--mama-brown)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--mama-pink)] transition-all resize-y min-h-[100px] bg-white disabled:bg-gray-50 disabled:border-gray-300"
              placeholder="Tulis pesan untuk penjual (opsional)..."
              value={notes}
              onChange={(e) => actions.handleNotesChange(e.target.value)}
              disabled={isLoadingCart || isSubmitting}
            />
          </section>

          {/* Action Button (Desktop hidden, Mobile visible) */}
          <div className="block lg:hidden mt-8">
            <button
              onClick={actions.handleCheckout}
              disabled={isLoadingCart || isSubmitting || !selectedShipping}
              className="w-full bg-[var(--mama-hot-pink)] hover:bg-[#c24467] text-white font-bold py-4 px-4 rounded-full transition-colors text-font-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase animate-fade-in"
            >
              {isSubmitting ? "Memproses..." : "Lanjut ke Pembayaran"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary Card */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Cart Items List */}
            <div className="p-5 space-y-5 border-b border-gray-200">
              {isLoadingCart
                ? Array.from({ length: 2 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-start animate-pulse"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-md shrink-0"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mt-2 self-end ml-auto"></div>
                      </div>
                    </div>
                  ))
                : cart?.items?.map((item) => {
                    const itemImage =
                      item.variant?.images?.[0]?.imageUrl ||
                      item.product?.images?.[0]?.imageUrl ||
                      "/images/placeholder.png";

                    return (
                      <div key={item.id} className="flex gap-4 items-start">
                        <div className="w-16 h-16 bg-pink-50 rounded-md shrink-0 flex items-center justify-center border border-pink-100 overflow-hidden relative">
                          <Image
                            src={itemImage}
                            alt={item.product?.name || "Product image"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <h4 className="text-font-1 font-bold text-black leading-snug line-clamp-2">
                              {item.product?.name}
                            </h4>
                            <span className="text-font-1 font-bold text-black whitespace-nowrap">
                              Qty {item.quantity}
                            </span>
                          </div>
                          <p className="text-font-1 text-gray-500 mt-1 font-medium">
                            {item.variant?.name}
                          </p>
                          <p className="text-font-2 font-bold text-red-600 mt-2 text-right">
                            {formatRupiah(
                              parseFloat(item.price) * item.quantity,
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* Calculations */}
            <div className="p-5 space-y-3 bg-white">
              <div className="flex justify-between text-font-2">
                <span className="text-gray-600">Subtotal</span>
                {isLoadingCart ? (
                  <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                ) : (
                  <span className="font-bold text-black">
                    {formatRupiah(totals.subtotal)}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-font-2">
                <span className="text-gray-600">Ongkos Kirim</span>
                {isCalculatingShipping ? (
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                ) : (
                  <span className="font-bold text-black">
                    {totals.shippingCost > 0
                      ? formatRupiah(totals.shippingCost)
                      : "-"}
                  </span>
                )}
              </div>

              {/* Pajak (Tax) */}
              <div className="flex justify-between text-font-2">
                <span className="text-gray-600">Pajak</span>
                {isLoadingCart ? (
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                ) : (
                  <span className="font-bold text-black">
                    {totals.tax > 0 ? formatRupiah(totals.tax) : "-"}
                  </span>
                )}
              </div>

              {totals.promoDiscount > 0 && (
                <div className="flex justify-between text-font-2">
                  <span className="text-gray-600">Promo</span>
                  <span className="font-bold text-red-600">
                    ({formatRupiah(totals.promoDiscount)})
                  </span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="bg-[var(--mama-hot-pink)] p-5 flex justify-between items-center text-white">
              <span className="text-font-2 font-bold uppercase">Total</span>
              {isLoadingCart || isCalculatingShipping ? (
                <div className="h-6 bg-pink-400 rounded w-24 animate-pulse"></div>
              ) : (
                <span className="text-font-4 font-bold">
                  {formatRupiah(totals.grandTotal)}
                </span>
              )}
            </div>
          </div>

          {/* Action Button (Desktop visible, Mobile hidden) */}
          <div className="hidden lg:block mt-6">
            <button
              onClick={actions.handleCheckout}
              disabled={isLoadingCart || isSubmitting || !selectedShipping}
              className="w-full bg-[var(--mama-hot-pink)] hover:bg-[#c24467] text-white font-bold py-4 px-4 rounded-full transition-colors text-font-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {isSubmitting ? "Memproses..." : "Lanjut ke Pembayaran"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
