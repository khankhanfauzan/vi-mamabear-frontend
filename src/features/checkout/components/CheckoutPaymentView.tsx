"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrderById } from "@/features/orders/services/orderService";
import { CheckoutStepper } from "@/features/checkout/components/shared/CheckoutStepper";

interface CheckoutPaymentViewProps {
  orderId: string;
  initialPaymentUrl: string | null;
}

export function CheckoutPaymentView({
  orderId,
  initialPaymentUrl,
}: CheckoutPaymentViewProps) {
  const router = useRouter();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    setErrorMessage(null);

    try {
      const order = await getOrderById(orderId);

      // Check if order state is successfully paid
      if (
        order.status === "PAYMENT_PAID" ||
        order.status === "CONFIRMED" ||
        order.status === "PROCESSED"
      ) {
        router.push(`/checkout/success/${orderId}`);
      } else {
        setErrorMessage(
          "Status pembayaran masih tertunda. Silakan selesaikan pembayaran di halaman Midtrans terlebih dahulu.",
        );
      }
    } catch (error) {
      console.error("Failed to check payment status:", error);
      setErrorMessage("Gagal mengecek status pembayaran. Silakan coba lagi.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-font-5 font-bold text-[var(--mama-brown)] mb-8">
        Check Out
      </h1>

      <CheckoutStepper activeStep={2} />

      <div className="max-w-2xl mx-auto py-12 px-6 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
        <h2 className="text-font-4 font-bold text-[var(--mama-brown)] mb-4">
          Menunggu Pembayaran
        </h2>
        <p className="text-font-2 text-gray-500 mb-8 max-w-md mx-auto">
          Silakan selesaikan pembayaran Anda melalui portal pembayaran aman
          kami. Jendela pembayaran dapat dibuka melalui tombol di bawah ini.
        </p>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 inline-block text-left w-full max-w-md">
            <p className="text-font-1 font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={initialPaymentUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-block bg-[var(--mama-pink)] hover:bg-[#f5b8c9] text-[var(--mama-brown)] font-bold py-4 px-8 rounded-full transition-colors text-font-2"
          >
            Buka Halaman Pembayaran
          </a>

          <button
            onClick={handleCheckStatus}
            disabled={isCheckingStatus}
            className="w-full sm:w-auto bg-[var(--mama-hot-pink)] hover:bg-[#c24467] text-white font-bold py-4 px-8 rounded-full transition-colors text-font-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCheckingStatus ? "Mengecek..." : "Cek Status Pembayaran"}
          </button>
        </div>
      </div>
    </div>
  );
}
