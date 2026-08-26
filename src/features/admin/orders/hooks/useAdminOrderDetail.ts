import { useState, useEffect, useCallback } from "react";
import { OrderDetail, OrderStatus } from "../types/adminOrder.types";
import {
  fetchAdminOrderById,
  updateAdminOrderStatus,
  fetchAdminOrderInvoice,
  updateAdminOrderTracking,
  cancelAdminOrder,
} from "../service/adminOrderService";

export function useAdminOrderDetail(orderId: string) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isUpdatingTracking, setIsUpdatingTracking] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminOrderById(orderId);
      setOrder(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil detail pesanan.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [fetchOrder, orderId]);

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    setIsUpdatingStatus(true);
    try {
      await updateAdminOrderStatus(order.id, { status: newStatus });
      await fetchOrder();
    } catch (err: unknown) {
      console.error("[useAdminOrderDetail] Failed to update status:", err);
      const message = err instanceof Error ? err.message : "Gagal memperbarui status pesanan.";
      alert(message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const updateTracking = async (trackingNumber: string) => {
    if (!order) return;
    setIsUpdatingTracking(true);
    try {
      await updateAdminOrderTracking(order.id, { trackingNumber });
      await fetchOrder();
    } catch (err: unknown) {
      console.error("[useAdminOrderDetail] Failed to update tracking:", err);
      const message = err instanceof Error ? err.message : "Gagal memperbarui nomor resi.";
      alert(message);
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  const cancelOrder = async (reason?: string) => {
    if (!order) return;
    setIsCancelling(true);
    try {
      await cancelAdminOrder(order.id, { notes: reason });
      await fetchOrder();
    } catch (err: unknown) {
      console.error("[useAdminOrderDetail] Failed to cancel order:", err);
      const message = err instanceof Error ? err.message : "Gagal membatalkan pesanan.";
      alert(message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePrintInvoice = async () => {
    try {
      const data = await fetchAdminOrderInvoice(orderId);
      if (data.invoiceUrl) {
        window.open(data.invoiceUrl, "_blank");
      }
    } catch (err: unknown) {
      console.error("[useAdminOrderDetail] Failed to print invoice:", err);
      const message = err instanceof Error ? err.message : "Gagal mencetak invoice.";
      alert(message);
    }
  };

  return {
    order,
    isLoading,
    error,
    isUpdatingStatus,
    isUpdatingTracking,
    isCancelling,
    updateStatus,
    updateTracking,
    cancelOrder,
    handlePrintInvoice,
    refetch: fetchOrder,
  };
}