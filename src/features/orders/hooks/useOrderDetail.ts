import { useState, useEffect, useCallback } from "react";
import { orderService } from "../services/orderService";
import { Order } from "@/features/orders/types/order.types";

/**
 * Hook to manage fetching and state for a specific order's details.
 */
export function useOrderDetail(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await orderService.getOrderById(orderId);
      setOrder(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil detail pesanan.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrderDetail,
  };
}
