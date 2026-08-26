"use client";

import React from "react";
import { OrderShippingAddress } from "@/features/orders/types/order.types";
import { MapPin } from "lucide-react";

interface OrderDetailAddressProps {
  address: OrderShippingAddress;
}

/**
 * Renders the shipping address card with the map pin icon.
 */
export default function OrderDetailAddress({ address }: OrderDetailAddressProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-white shadow-sm flex items-start gap-4">
      <div className="mt-1 flex-shrink-0">
        <MapPin className="w-6 h-6 text-[var(--mama-brown)]" />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-font-2 font-bold text-[var(--mama-brown)]">
          {address.usedFor || address.name}
        </h4>
        <p className="text-font-2 font-bold text-[var(--mama-brown)]">
          {address.phone}
        </p>
        <p className="text-font-2 text-[var(--color-gray)] leading-relaxed mt-1">
          {address.completeAddress}
        </p>
        {address.detail && (
          <p className="text-font-1 text-[var(--color-gray)] mt-1 italic">
            Catatan: {address.detail}
          </p>
        )}
      </div>
    </div>
  );
}