"use client";

import React from "react";
import { Check } from "lucide-react";
import { OrderDetail } from "@/features/admin/orders/types/adminOrder.types";
import {
  STATUS_SEQUENCE,
  FAILED_STATUSES,
} from "@/features/admin/orders/utils/orderStatus";

interface AdminOrderTimelineProps {
  order: OrderDetail;
}

export function AdminOrderTimeline({ order }: AdminOrderTimelineProps) {
  // Map history to easily check if a status was reached and when
  const historyMap = order.orderStatusHistory.reduce(
    (acc, curr) => {
      acc[curr.status] = curr.createdAt;
      return acc;
    },
    {} as Record<string, string>,
  );

  // Determine how far along the sequence we are based on current status
  const currentIndex = STATUS_SEQUENCE.findIndex((s) => s.key === order.status);
  const isFailedFlow = FAILED_STATUSES.includes(order.status);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr)
      .toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  };

  if (isFailedFlow) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-6">
        <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-6">
          Riwayat Pesanan
        </h2>
        <div className="flex items-start gap-4 text-red-500">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span className="font-bold">X</span>
          </div>
          <div>
            <p className="font-medium text-font-2">
              Pesanan Bermasalah ({order.status})
            </p>
            <p className="text-sm mt-1">{formatDate(order.updatedAt)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-6">
      <h2 className="text-font-3 font-bold text-[var(--mama-brown)] mb-6">
        Riwayat Pesanan
      </h2>

      <div className="relative pl-4">
        {STATUS_SEQUENCE.map((step, index) => {
          // A step is considered "done" if we are past it in the sequence, or if it exists in history.
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const dateStr =
            historyMap[step.key] || (isCurrent ? order.updatedAt : undefined);

          return (
            <div key={step.key} className="relative pb-8 last:pb-0">
              {/* Connecting Line */}
              {index !== STATUS_SEQUENCE.length - 1 && (
                <div
                  className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
                    index < currentIndex
                      ? "bg-[var(--mama-hot-pink)]"
                      : "bg-gray-200"
                  }`}
                />
              )}

              <div className="flex items-start gap-4">
                {/* Node/Circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    isCompleted
                      ? "bg-[var(--mama-hot-pink)] border-[var(--mama-hot-pink)] text-white"
                      : "bg-white border-gray-300 text-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1">
                  <p
                    className={`text-font-2 font-medium ${
                      isCompleted
                        ? "text-[var(--color-gray)]"
                        : "text-[var(--color-light-gray)]"
                    }`}
                  >
                    {step.label}
                  </p>
                  {dateStr && (
                    <p className="text-sm text-[var(--color-light-gray)] mt-1">
                      {formatDate(dateStr)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
