"use client";

import React from "react";
import { formatDate } from "@/features/orders/utils/orderFormatting";
import { OrderStatus } from "@/features/orders/types/order.types";

interface OrderDetailStepperProps {
  currentStatus: OrderStatus;
  updatedAt: string;
}

// Updated mapping to handle the new backend schema
const STEPS = [
  {
    id: 1,
    label: "Pesanan dikonfirmasi",
    matchStatuses: ["PAYMENT_PAID", "CONFIRMED"],
  },
  { id: 2, label: "Pesanan diproses", matchStatuses: ["PROCESSED"] },
  { id: 3, label: "Pesanan dikirim", matchStatuses: ["SENDING"] },
  { id: 4, label: "Pesanan Selesai", matchStatuses: ["RECEIVED", "COMPLETED"] },
];

/**
 * Renders the visual progress bar (stepper) for the order status.
 */
export default function OrderDetailStepper({
  currentStatus,
  updatedAt,
}: OrderDetailStepperProps) {
  // Determine current active step index based on status
  const activeStepIndex = STEPS.findIndex((step) =>
    step.matchStatuses.includes(currentStatus),
  );

  // Handling for alternative final states
  const isCancelled = ["CANCELLED", "REFUNDED"].includes(currentStatus);
  const isPending = currentStatus === "PAYMENT_PENDING";

  if (isCancelled) {
    return (
      <div className="w-full py-6 flex justify-center items-center bg-gray-50 rounded-xl border border-gray-200 mb-8">
        <p className="text-[var(--color-gray)] font-bold text-font-3">
          Pesanan ini telah dibatalkan atau dikembalikan.
        </p>
      </div>
    );
  }

  if (isPending) {
    return;
    // <div className="w-full py-6 flex flex-col justify-center items-center bg-red-50 rounded-xl border border-red-100 mb-8 gap-2">
    //   <p className="text-red-600 font-bold text-font-3">
    //     Menunggu Pembayaran
    //   </p>
    //   <p className="text-red-500 text-font-1">
    //     Segera selesaikan pembayaran agar pesanan dapat diproses.
    //   </p>
    // </div>
  }

  return (
    <div className="w-full relative py-6 mb-8">
      {/* Background connecting line */}
      <div className="absolute top-10 left-[10%] right-[10%] h-[2px] bg-gray-200 -z-10" />

      <div className="flex justify-between w-full">
        {STEPS.map((step, index) => {
          const isActiveOrPast = activeStepIndex >= index;
          const isCurrent = activeStepIndex === index;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1 relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-font-3 font-bold mb-3 transition-colors duration-300 ${
                  isActiveOrPast
                    ? "bg-[var(--mama-pink)] text-[var(--mama-brown)]"
                    : "bg-white border-2 border-gray-200 text-gray-300"
                }`}
              >
                {step.id}
              </div>

              <p
                className={`text-center text-font-1 md:text-font-2 px-1 ${
                  isActiveOrPast
                    ? "text-[var(--mama-brown)] font-bold"
                    : "text-gray-400 font-medium"
                }`}
              >
                {step.label}
              </p>

              {/* Show date only on the current active step */}
              {isCurrent && updatedAt && (
                <p className="text-center text-[10px] md:text-font-1 text-[var(--color-gray)] mt-1">
                  {formatDate(updatedAt)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
