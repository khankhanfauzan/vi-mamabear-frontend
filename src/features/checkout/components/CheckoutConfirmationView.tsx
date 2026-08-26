"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { CheckoutStepper } from "@/features/checkout/components/shared/CheckoutStepper";

interface CheckoutConfirmationViewProps {
  orderId: string;
}

export function CheckoutConfirmationView({
  orderId,
}: CheckoutConfirmationViewProps) {
  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-font-5 font-bold text-[var(--mama-brown)] mb-8">
        Check Out
      </h1>

      <CheckoutStepper activeStep={3} />

      <div className="max-w-xl mx-auto py-16 text-center space-y-6">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-24 h-24 text-[var(--mama-hot-pink)]" />
        </div>

        <h2 className="text-font-4 font-bold text-[var(--mama-brown)]">
          Pembayaran Berhasil!
        </h2>

        <p className="text-font-2 text-gray-600 max-w-sm mx-auto">
          Terima kasih, pembayaran pesanan Mama telah kami terima. Kami akan
          segera memproses dan mengirimkan pesanan Anda.
        </p>

        <p className="text-font-1 text-gray-400">ID Pesanan: {orderId}</p>

        <div className="pt-8">
          <Link
            href="/account/orders"
            className="inline-block bg-[var(--mama-hot-pink)] hover:bg-[#c24467] text-white font-bold py-4 px-12 rounded-full transition-colors text-font-3 uppercase min-w-[280px]"
          >
            Lihat Daftar Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}
