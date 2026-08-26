import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { orderService } from "../services/orderService";
import { Order } from "../types/order.types";

/**
 * Hook to manage fetching, pagination, and state for the order list.
 */
export function useOrderList() {
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchOrders = useCallback(
    async (cursor?: string, isLoadMore = false) => {
      if (!isLoadMore) {
        setIsLoading(true);
        setOrders([]);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        // Map "ALL" back to undefined so we don't send it to the backend
        const statusParam = currentStatus === "ALL" ? undefined : currentStatus;

        const response = await orderService.getOrders({
          limit: 10,
          status: statusParam,
          cursor: cursor,
        });

        // Safely extract the data array whether the service returns a PaginatedOrders object or an array
        const isPaginatedObj =
          response && !Array.isArray(response) && "data" in response;
        const ordersData: Order[] = isPaginatedObj ? response.data : response;
        const paginationMeta = isPaginatedObj ? response.pagination : null;

        if (isLoadMore) {
          setOrders((prev) => [...prev, ...ordersData]);
        } else {
          setOrders(ordersData);
        }

        // Use the official pagination metadata from the API if available
        if (paginationMeta) {
          setHasMore(paginationMeta.hasNextPage);
          // Set to undefined if null so it aligns with our state type
          setNextCursor(paginationMeta.nextCursor || undefined);
        } else {
          // Fallback array-based pagination logic just in case
          if (ordersData.length < 10) {
            setHasMore(false);
            setNextCursor(undefined);
          } else {
            setHasMore(true);
            setNextCursor(ordersData[ordersData.length - 1]?.id);
          }
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Gagal mengambil data pesanan.",
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [currentStatus],
  );

  // Initial fetch when status or searchParams change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore && nextCursor) {
      fetchOrders(nextCursor, true);
    }
  };

  return {
    orders,
    currentStatus,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    handleLoadMore,
  };
}
