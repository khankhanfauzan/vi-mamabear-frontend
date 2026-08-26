import { AdminOrderDetailOrchestrator } from "@/features/admin/orders/components/edit/AdminOrderDetailOrchestrator";
import React, { Suspense } from "react";

export const metadata = {
  title: "Detail Pesanan | Admin MamaBear",
  description: "Kelola dan perbarui status pesanan pelanggan.",
};

export default function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="page-max-width w-full px-4 py-8 md:py-12 min-h-screen">
      <Suspense
        fallback={
          <div className="w-full min-h-[60vh] flex items-center justify-center">
            {/* Initial page load skeleton */}
            <div className="w-12 h-12 border-4 border-[var(--mama-pink)] border-t-[var(--mama-hot-pink)] rounded-full animate-spin"></div>
          </div>
        }
      >
        <AdminOrderDetailOrchestrator orderId={params.id} />
      </Suspense>
    </main>
  );
}
