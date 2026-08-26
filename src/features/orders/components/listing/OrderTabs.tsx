"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderStatus } from "../../types/order.types";

// Updated matching the backend enum exactly
const TABS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Belum Dibayar", value: "PAYMENT_PENDING" },
  { label: "Sudah Dibayar", value: "PAYMENT_PAID" },
  { label: "Dikonfirmasi", value: "CONFIRMED" },
  { label: "Diproses", value: "PROCESSED" },
  { label: "Dikirim", value: "SENDING" },
  { label: "Selesai", value: "COMPLETED" },
  { label: "Dibatalkan", value: "CANCELLED" },
];

export default function OrderTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const handleTabClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    // Reset cursor when switching tabs
    params.delete("cursor");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex w-full overflow-x-auto border-b border-gray-200 hide-scrollbar mb-6">
      <div className="flex gap-6 px-2">
        {TABS.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleTabClick(tab.value)}
              className={`whitespace-nowrap pb-3 text-font-2 transition-colors relative ${
                isActive
                  ? "text-[var(--mama-brown)] font-bold"
                  : "text-[var(--color-light-gray)] hover:text-[var(--color-gray)] font-medium"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--mama-pink)] rounded-t-md" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}