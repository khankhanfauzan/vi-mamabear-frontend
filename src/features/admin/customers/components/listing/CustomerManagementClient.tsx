"use client";

import React from "react";
import { CustomerFilters } from "./CustomerFilters";
import { CustomerTable } from "./CustomerTable";
import { CustomersPayload } from "@/features/admin/customers/types/customer.types";
import { useAdminCustomers } from "@/features/admin/customers/hooks/useAdminCustomers";
import { CustomerPagination } from "@/features/admin/customers/components/listing/CustomerPagination";

interface CustomerManagementClientProps {
  initialData: CustomersPayload;
}

export function CustomerManagementClient({
  initialData,
}: CustomerManagementClientProps) {
  const {
    customers,
    pagination,
    isPending,
    isExporting,
    handleFilterChange,
    goToPage,
    handleExport,
  } = useAdminCustomers(initialData);

  return (
    <div className="flex flex-col w-full">
      <CustomerFilters
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        isExporting={isExporting}
        isPending={isPending}
      />

      <div
        className={`bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : "opacity-100"}`}
      >
        <CustomerTable customers={customers} />

        <CustomerPagination
          pagination={pagination}
          isPending={isPending}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
}
