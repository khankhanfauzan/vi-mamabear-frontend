"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { exportAdminCustomers } from "../services/customerService";
import {
  Customer,
  CustomersPayload,
} from "@/features/admin/customers/types/customer.types";

export function useAdminCustomers(initialData: CustomersPayload) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [customers, setCustomers] = useState<Customer[]>(initialData.data);
  const [pagination, setPagination] = useState(initialData.pagination);

  const [isExporting, setIsExporting] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCustomers(initialData.data);
    setPagination(initialData.pagination);
  }, [initialData]);

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Always reset to page 1 when filters change
      params.delete("page");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage === pagination.page) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams, pagination.page],
  );

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const blob = await exportAdminCustomers();

      // Create a download link for the CSV Blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `customers_export_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[useAdminCustomers] Failed to export customers:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    customers,
    pagination,
    isPending,
    isExporting,
    handleFilterChange,
    goToPage,
    handleExport,
  };
}