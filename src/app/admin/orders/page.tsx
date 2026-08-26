import { AdminOrderListing } from "@/features/admin/orders/components/listing/AdminOrderListing";
import React, { Suspense } from "react";

export const metadata = {
  title: "Kelola Pesanan | Admin MamaBear",
  description:
    "Dasbor admin untuk mengelola dan melacak pesanan pelanggan MamaBear.",
};

export default function AdminOrdersPage() {
  return (
    <main className="page-max-width w-full px-4 py-8 md:py-12 min-h-screen">
      <Suspense
        fallback={
          <div className="w-full h-64 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[var(--mama-pink)] border-t-[var(--mama-hot-pink)] rounded-full animate-spin"></div>
          </div>
        }
      >
        <AdminOrderListing />
      </Suspense>
    </main>
  );
}
