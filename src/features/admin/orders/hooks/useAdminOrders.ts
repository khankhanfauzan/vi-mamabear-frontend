import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { OrderDetail, OrderStatus } from "../types/adminOrder.types"; // Adjusted based on your new path
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
  exportAdminOrdersCSV,
} from "../service/adminOrderService";

export function useAdminOrders() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Now storing OrderDetail[] since the list endpoint returns full details
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Local state for debouncing the search input
  const [searchInput, setSearchInput] = useState<string>(
    searchParams.get("search") || "",
  );

  const isFirstRender = useRef(true);
  const pendingUrlParams = useRef<URLSearchParams | null>(null);
  const urlUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAdminOrders(searchParams);

      // Strictly typed extraction based on the new API response
      setOrders(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil data pesanan.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Sync debounced search input to URL using the new 'search' key
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const currentQuery = searchParams.get("search") || "";

      if (searchInput !== currentQuery) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchInput) {
          params.set("search", searchInput);
        } else {
          params.delete("search");
        }
        params.set("page", "1"); // Reset pagination on new search
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput, pathname, router, searchParams]);

  // General function to update URL params for filters & sorting (supports batching sync calls)
  const updateUrlParams = (keyOrUpdates: string | Record<string, string>, value?: string) => {
    // Use pending params if multiple updates are fired synchronously, otherwise start fresh
    const params = pendingUrlParams.current || new URLSearchParams(searchParams.toString());
    
    // Normalize input to always be an object for a single processing loop
    const updates = typeof keyOrUpdates === "string" 
      ? { [keyOrUpdates]: value } 
      : keyOrUpdates;

    // Apply all updates
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== "ALL" && v !== "null") {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });

    // Reset pagination to page 1 if the updates don't explicitly handle the page
    if (!("page" in updates)) {
      params.set("page", "1");
    }

    // Store the mutated params
    pendingUrlParams.current = params;

    // Clear previous timeout and set a new one to batch the router.push
    if (urlUpdateTimeout.current) clearTimeout(urlUpdateTimeout.current);

    urlUpdateTimeout.current = setTimeout(() => {
      if (pendingUrlParams.current) {
        router.push(`${pathname}?${pendingUrlParams.current.toString()}`, { scroll: false });
        pendingUrlParams.current = null;
      }
    }, 10); // Small delay batches synchronous updates
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateAdminOrderStatus(orderId, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      console.error("[useAdminOrders] Failed to update status:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Gagal memperbarui status pesanan.";
      alert(errorMessage);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const blob = await exportAdminOrdersCSV(searchParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Data-Pesanan-MamaBear-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[useAdminOrders] Failed to export CSV:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Gagal mengekspor data CSV.";
      alert(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    orders,
    isLoading,
    error,
    isExporting,
    searchInput,
    setSearchInput,
    updateUrlParams,
    updateStatus,
    handleExportCSV,
    currentStatus: searchParams.get("status") || "ALL",
    currentPage: parseInt(searchParams.get("page") || "1", 10),
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    totalPages,
  };
}