import React from "react";
import { notFound } from "next/navigation";
import { fetchAdminCustomerById } from "@/features/admin/customers/services/customerService";
import { CustomerDetailClient } from "@/features/admin/customers/components/edit/CustomerDetailClient";

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  try {
    const customerDetail = await fetchAdminCustomerById(params.id);

    if (!customerDetail) {
      notFound();
    }

    return (
      <div className="page-max-width py-8 px-4 sm:px-6 lg:px-8 w-full min-h-screen">
        <CustomerDetailClient initialData={customerDetail} />
      </div>
    );
  } catch (error) {
    console.error("[CustomerDetailPage] Error fetching data:", error);
    return (
      <div className="page-max-width py-16 px-4 text-center">
        <h2 className="text-font-4 font-bold text-[var(--mama-brown)] mb-2">
          Terjadi Kesalahan
        </h2>
        <p className="text-font-2 text-gray-500">
          Gagal memuat detail pelanggan. Silakan coba lagi nanti.
        </p>
      </div>
    );
  }
}
