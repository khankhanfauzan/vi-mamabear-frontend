import { CustomerManagementClient } from "@/features/admin/customers/components/listing/CustomerManagementClient";
import { fetchAdminCustomers } from "@/features/admin/customers/services/customerService";
import React, { Suspense } from "react";

interface AdminCustomersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AdminCustomersPage({
  searchParams,
}: AdminCustomersPageProps) {
  // Extract and parse URL params for server-side fetching
  const pageParam =
    typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const isBlockedParam =
    typeof searchParams.isBlocked === "string"
      ? searchParams.isBlocked
      : undefined;

  let isBlocked: boolean | undefined = undefined;
  if (isBlockedParam === "true") isBlocked = true;
  if (isBlockedParam === "false") isBlocked = false;

  const initialData = await fetchAdminCustomers({
    page,
    limit: 20,
    search,
    isBlocked,
  });

  return (
    <div className="page-max-width py-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="mb-8">
        <h1 className="text-font-4 md:text-font-5 font-bold text-[var(--mama-brown)]">
          Manajemen Pelanggan
        </h1>
        <p className="text-font-2 text-gray-500 mt-2">
          Kelola data pelanggan, riwayat pesanan, dan status verifikasi.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="w-full h-96 animate-pulse bg-gray-100 rounded-lg" />
        }
      >
        <CustomerManagementClient initialData={initialData} />
      </Suspense>
    </div>
  );
}
