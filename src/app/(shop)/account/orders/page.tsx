import OrderList from "@/features/orders/components/listing/OrderList";
import React, { Suspense } from "react";

export const metadata = {
  title: "Daftar Pesanan | MamaBear",
  description: "Lihat dan kelola status pesanan Anda di MamaBear.",
};

export default function OrdersPage() {
  return (
    <main className="page-max-width py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-font-5 font-bold text-[var(--mama-brown)]">
          Pesanan Saya
        </h1>
        <p className="text-font-2 text-[var(--color-gray)] mt-2">
          Pantau riwayat dan status pengiriman produk MamaBear Anda.
        </p>
      </div>

      {/* Client Components reading useSearchParams must be wrapped in Suspense.
        We provide a minimal fallback skeleton while the client mount.
      */}
      <Suspense
        fallback={
          <div className="w-full flex flex-col gap-4 mt-12">
            <div className="h-10 w-full bg-gray-100 animate-pulse rounded-md" />
            <div className="h-48 w-full bg-gray-100 animate-pulse rounded-xl" />
          </div>
        }
      >
        <OrderList />
      </Suspense>
    </main>
  );
}
