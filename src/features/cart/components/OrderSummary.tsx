import React from "react";
import { formatIDR } from "@/utils/formatters";

export const OrderSummary = ({
  subtotal,
  discountAmount,
  grandTotal,
  promoCode,
  setPromoCode,
  appliedPromo,
  handleApplyPromo,
  selectedCount,
  handleCheckout,
  isCheckingOut,
}: {
  subtotal: number;
  discountAmount: number;
  grandTotal: number;
  promoCode: string;
  setPromoCode: (val: string) => void;
  appliedPromo: string | null;
  handleApplyPromo: () => void;
  selectedCount: number;
  handleCheckout: () => void;
  isCheckingOut: boolean;
}) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white sticky top-24 shadow-sm">
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center text-font-2 text-[var(--mama-brown)]">
          <span className="font-semibold">Subtotal</span>
          <span className="text-font-3 font-bold">{formatIDR(subtotal)}</span>
        </div>

        <hr className="border-gray-100" />

        <div className="flex justify-between items-center text-font-2 text-[var(--mama-brown)]">
          <span className="font-semibold">Ongkos Kirim</span>
          <span className="text-font-1 font-medium max-w-[120px] text-right">
            Dihitung saat checkout
          </span>
        </div>
      </div>

      <hr className="border-gray-100 mb-6" />

      {}
      <div className="mb-6">
        <label className="block text-font-2 font-semibold text-[var(--mama-brown)] mb-3">
          Kode Promo
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="MAMABEAR"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-font-2 focus:outline-none focus:border-[var(--mama-hot-pink)] text-[var(--color-gray)] uppercase"
            disabled={!!appliedPromo}
          />
          <button
            onClick={handleApplyPromo}
            disabled={!promoCode || !!appliedPromo}
            className="bg-[var(--mama-hot-pink)] text-white px-6 py-2 rounded-lg font-bold text-font-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            PAKAI
          </button>
        </div>
      </div>

      {}
      <div className="space-y-4 mb-8">
        {appliedPromo && (
          <div className="flex justify-between items-center text-font-2 text-[var(--mama-hot-pink)]">
            <span className="font-semibold">Promo</span>
            <span className="font-bold">({formatIDR(discountAmount)})</span>
          </div>
        )}

        <div className="flex justify-between items-center text-font-2 text-[var(--mama-brown)]">
          <span className="font-semibold">Subtotal</span>
          <span className="text-font-5 font-bold">{formatIDR(grandTotal)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={selectedCount === 0 || isCheckingOut}
        className="w-full flex justify-center items-center gap-2 bg-[var(--mama-hot-pink)] text-white py-4 rounded-full font-bold text-font-4 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
      >
        {isCheckingOut ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "CHECK OUT"
        )}
      </button>
    </div>
  );
};
