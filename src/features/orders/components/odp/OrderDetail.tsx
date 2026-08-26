"use client";

import React from "react";
import Link from "next/link";
import OrderDetailStepper from "./OrderDetailStepper";
import OrderDetailAddress from "./OrderDetailAddress";
import OrderDetailSummary from "./OrderDetailSummary";
import { AlertCircle, Download, FileText } from "lucide-react";
import { useDownloadInvoice } from "@/features/orders/hooks/useDownloadInvoice";
import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail";

interface OrderDetailProps {
  orderId: string;
}

/**
 * Main Client component orchestrating the detail view of a single order.
 */
export default function OrderDetail({ orderId }: OrderDetailProps) {
  const { order, isLoading, error } = useOrderDetail(orderId);
  const { download, isDownloading } = useDownloadInvoice();

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-6">
        <div className="h-24 bg-gray-100 rounded-xl w-full" />
        <div className="h-32 bg-gray-100 rounded-xl w-full" />
        <div className="h-64 bg-gray-100 rounded-xl w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-red-50 rounded-xl border border-red-100">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-font-4 font-bold text-red-700 mb-2">
          Gagal Memuat Pesanan
        </h2>
        <p className="text-font-2 text-red-600 max-w-md">
          {error ||
            "Pesanan yang Anda cari tidak ditemukan atau terjadi kesalahan sistem."}
        </p>
      </div>
    );
  }

  // Assuming a mock estimated delivery 5 days from creation
  const estimasiTiba = new Date(order.createdAt);
  estimasiTiba.setDate(estimasiTiba.getDate() + 5);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="w-full flex flex-col">
      {/* Show Midtrans Payment Button if Pending and URL exists */}
      {order.status === "PAYMENT_PENDING" && order.paymentRedirectUrl && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-2 mb-6 p-5 bg-red-50 rounded-xl border border-red-100">
          <div className="flex flex-col gap-1">
            <h3 className="text-font-3 font-bold text-red-600">
              Lanjutkan Pembayaran
            </h3>
            <p className="text-font-1 text-red-500 max-w-md leading-relaxed">
              Selesaikan pembayaran Anda menggunakan berbagai metode pembayaran
              yang tersedia agar pesanan dapat segera diproses.
            </p>
          </div>
          <a
            href={order.paymentRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-8 py-3 bg-[var(--mama-hot-pink)] text-white rounded-full font-bold hover:bg-pink-600 transition-colors shadow-md text-center w-full md:w-auto"
          >
            Bayar Sekarang
          </a>
        </div>
      )}

      <OrderDetailStepper
        currentStatus={order.status}
        updatedAt={order.updatedAt}
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-font-3 font-bold text-[var(--mama-brown)]">
            Order : #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
          </h2>

          {/* Hide estimated delivery if cancelled, refunded, or already completed/received */}
          {!["CANCELLED", "REFUNDED", "COMPLETED", "RECEIVED"].includes(
            order.status,
          ) && (
            <p className="text-font-3 font-bold text-[var(--mama-brown)]">
              Estimasi Tiba : {formatter.format(estimasiTiba)}
            </p>
          )}
        </div>

        <button
          onClick={() => download(order.id)}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-2 bg-white border border-gray-200 text-[var(--mama-brown)] font-bold rounded-full text-font-2 sm:text-font-1 hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm sm:shadow-none"
        >
          <Download className="w-5 h-5 sm:w-4 sm:h-4" />
          {isDownloading ? "Mengunduh..." : "Unduh Invoice"}
        </button>
      </div>

      <OrderDetailAddress address={order.shippingAddress} />

      {/* Catatan Pesanan dari Pembeli */}
      {order.notes && (
        <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-white shadow-sm flex items-start gap-4">
          <div className="mt-1 flex-shrink-0">
            <FileText className="w-6 h-6 text-[var(--mama-brown)]" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-font-2 font-bold text-[var(--mama-brown)]">
              Catatan Pesanan
            </h4>
            <p className="text-font-2 text-[var(--color-gray)] leading-relaxed mt-1">
              {order.notes}
            </p>
          </div>
        </div>
      )}

      <OrderDetailSummary order={order} />

      {/* Actions & Warning Footer */}
      {/* Cancellation is typically allowed before the order is PROCESSED */}
      {["PAYMENT_PENDING", "PAYMENT_PAID", "CONFIRMED"].includes(
        order.status,
      ) && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-2 mb-10">
          <p className="text-font-1 text-[var(--color-gray)] max-w-md leading-relaxed">
            Pesanan dapat dibatalkan selama belum masuk ke tahap Diproses.
            Silakan chat dengan tim MamaBear jika Anda ingin mengajukan
            pembatalan.
          </p>
          <Link
            href="https://api.whatsapp.com/send/?phone=628888695757&text&type=phone_number&app_absent=0"
            target="_blank"
            className="whitespace-nowrap px-6 py-3 border-2 border-[var(--mama-hot-pink)] text-[var(--mama-hot-pink)] bg-white rounded-full font-bold hover:bg-pink-50 transition-colors text-center w-full md:w-auto"
          >
            Chat dengan MamaBear
          </Link>
        </div>
      )}
    </div>
  );
}
