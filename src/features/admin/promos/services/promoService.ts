import { apiClient } from "@/lib/api";
import { CreatePromoDto, Promo, UpdatePromoDto } from "../types/promo.types";

interface PaginatedPromos {
  data: Promo[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}

const defaultOptions: RequestInit = {
  credentials: "include",
};

export const promoService = {
  getPromos: async (page = 1, limit = 10): Promise<PaginatedPromos> => {
    const res = await apiClient.get(`/admin/promo?page=${page}&limit=${limit}`, defaultOptions);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to fetch promos");
    return json.data;
  },

  getPromoById: async (id: string): Promise<Promo> => {
    const res = await apiClient.get(`/admin/promo/${id}`, defaultOptions);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to fetch promo");
    return json.data;
  },

  createPromo: async (data: CreatePromoDto): Promise<Promo> => {
    const res = await apiClient.post(`/admin/promo`, data, defaultOptions);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to create promo");
    return json.data;
  },

  updatePromo: async (id: string, data: UpdatePromoDto): Promise<Promo> => {
    const res = await apiClient.patch(`/admin/promo/${id}`, data, defaultOptions);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to update promo");
    return json.data;
  },

  deletePromo: async (id: string): Promise<void> => {
    const res = await apiClient.delete(`/admin/promo/${id}`, defaultOptions);
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message || "Failed to delete promo");
    }
  },
};
