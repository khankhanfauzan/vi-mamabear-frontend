"use client";

import React from "react";
import { CustomerDetail } from "@/features/admin/customers/types/customer.types";
import { useCustomerDetail } from "../../hooks/useCustomerDetail";
import { CustomerDetailHeader } from "./CustomerDetailHeader";
import { CustomerStats } from "./CustomerStats";
import { CustomerOrderHistory } from "./CustomerOrderHistory";
import { CustomerContactInfo } from "./CustomerContactInfo";
import { CustomerStatusManager } from "./CustomerStatusManager";

interface CustomerDetailClientProps {
  initialData: CustomerDetail;
}

export function CustomerDetailClient({
  initialData,
}: CustomerDetailClientProps) {
  const { customer, isUpdatingStatus, updateError, handleUpdateStatus } =
    useCustomerDetail(initialData);

  return (
    <div className="flex flex-col w-full">
      <CustomerDetailHeader customer={customer} />
      <CustomerStats customer={customer} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col h-full">
          <CustomerOrderHistory orders={customer.orderHistory} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <CustomerContactInfo customer={customer} />
          <CustomerStatusManager
            currentStatus={customer.isBlocked}
            isUpdating={isUpdatingStatus}
            error={updateError}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </div>
  );
}
