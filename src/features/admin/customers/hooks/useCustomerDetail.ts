"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCustomerStatus } from '../services/customerService';
import {CustomerDetail} from '@/features/admin/customers/types/customer.types';

export function useCustomerDetail(initialData: CustomerDetail) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetail>(initialData);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdateStatus = async (newStatus: boolean) => {
    setIsUpdatingStatus(true);
    setUpdateError(null);
    try {
      await updateCustomerStatus(customer.id, newStatus);
      // Optimistically update local state on success
      setCustomer(prev => ({ ...prev, isBlocked: newStatus }));
      // Tell Next.js to refresh server-side data in the background
      router.refresh();
    } catch (error) {
      console.error("[useCustomerDetail] Failed to update status:", error);
      if (error instanceof Error) {
        setUpdateError(error.message);
      } else {
        setUpdateError("Gagal memperbarui status pelanggan.");
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return {
    customer,
    isUpdatingStatus,
    updateError,
    handleUpdateStatus,
  };
}