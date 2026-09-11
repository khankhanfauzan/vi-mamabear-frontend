import { useState, useEffect } from "react";
import { Promo } from "../types/promo.types";
import { promoService } from "../services/promoService";
import { toast } from "sonner";

export function usePromoList() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<Promo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPromos = async (p: number = page) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await promoService.getPromos(p);
      setPromos(res.data);
      setTotalPages(res.meta.lastPage);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch promos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const initiateDelete = (promo: Promo) => {
    setPromoToDelete(promo);
  };

  const cancelDelete = () => {
    setPromoToDelete(null);
  };

  const confirmDelete = async () => {
    if (!promoToDelete) return;
    setIsDeleting(true);
    try {
      await promoService.deletePromo(String(promoToDelete.id));
      toast.success("Promo deleted successfully");
      fetchPromos();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete promo");
    } finally {
      setIsDeleting(false);
      setPromoToDelete(null);
    }
  };

  return {
    promos,
    isLoading,
    error,
    promoToDelete,
    isDeleting,
    page,
    totalPages,
    setPage,
    initiateDelete,
    cancelDelete,
    confirmDelete,
    fetchPromos,
  };
}
