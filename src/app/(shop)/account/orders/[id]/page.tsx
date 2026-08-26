import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import OrderDetail from "@/features/orders/components/odp/OrderDetail";

export const metadata = {
  title: "Detail Pesanan | MamaBear",
  description: "Rincian status dan produk dari pesanan MamaBear Anda.",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: PageProps) {
  return (
    <main className="page-max-width py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-font-2 text-[var(--color-gray)] hover:text-[var(--mama-brown)] transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Daftar Pesanan
      </Link>

      <div className="mb-6">
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Detail Pesanan
        </h1>
      </div>

      {/* Server Component safely passes params.id to Client Orchestrator */}
      <OrderDetail orderId={params.id} />
    </main>
  );
}
