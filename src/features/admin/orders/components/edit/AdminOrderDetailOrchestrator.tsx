"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

// Subcomponents
import { AdminOrderItems } from "./AdminOrderItems";
import { AdminOrderTimeline } from "./AdminOrderTimeline";
import {
  AdminOrderCustomerCard,
  AdminOrderDeliveryCard,
  AdminOrderActionsCard,
} from "./AdminOrderDetailCards";
import { useAdminOrderDetail } from "@/features/admin/orders/hooks/useAdminOrderDetail";

interface Props {
  orderId: string;
}

export function AdminOrderDetailOrchestrator({ orderId }: Props) {
  const router = useRouter();
  const { 
    order, 
    isLoading, 
    error, 
    isUpdatingStatus,
    isUpdatingTracking, 
    isCancelling, 
    updateStatus, 
    updateTracking, 
    cancelOrder,
    handlePrintInvoice
  } = useAdminOrderDetail(orderId);


  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--mama-pink)] border-t-[var(--mama-hot-pink)] rounded-full animate-spin"></div>
        <p className="text-[var(--color-gray)] font-medium">
          Memuat Detail Pesanan...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-lg p-8 text-center flex flex-col items-center gap-4">
        <p className="text-red-600 text-font-3 font-bold">
          {error || "Pesanan tidak ditemukan"}
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-white border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-50 cursor-pointer"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/orders")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--color-gray)]" />
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-font-5 md:text-font-6 font-bold text-[var(--mama-brown)] flex items-center gap-3">
              Pesanan #{order.id.slice(0,8).toUpperCase()}
              {order.status === "PAYMENT_PAID" && (
                <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold tracking-wide">
                  PAID
                </span>
              )}
            </h1>
            <p className="text-font-2 text-[var(--color-gray)] font-medium">
              Tanggal: {new Date(order.createdAt).toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintInvoice}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-font-2 font-bold text-[var(--color-gray)] hover:bg-gray-50 transition-colors ml-14 md:ml-0 cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          Cetak Invoice
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-4">
        {/* Left Column (Spans 2 cols on Desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AdminOrderItems order={order} />
          <AdminOrderTimeline order={order} />
        </div>

        {/* Right Column (Spans 1 col on Desktop) */}
        <div className="flex flex-col gap-6">
          <AdminOrderCustomerCard order={order} />
          
          <AdminOrderDeliveryCard 
            order={order} 
            isUpdatingTracking={isUpdatingTracking} 
            onUpdateTracking={updateTracking} 
          />
          
          <AdminOrderActionsCard
            order={order}
            isUpdatingStatus={isUpdatingStatus}
            isCancelling={isCancelling}
            onUpdateStatus={updateStatus}
            onCancelOrder={cancelOrder}
          />
        </div>
      </div>
    </div>
  );
}