import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api.types"; // Adjust import path based on your global types
import {
  Region,
  Subdistrict,
  ShippingOption,
  CalculateShippingCostRequest,
} from "../types/shipping.types";

/**
 * Fetches all available provinces.
 * Cached aggressively as province data rarely changes.
 */
export async function getProvinces(): Promise<Region[]> {
  try {
    const res = await apiClient.get(`/shipping/province`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil provinsi: HTTP ${res.status}`);
    }

    const response: ApiResponse<Region[]> = await res.json();

    if (!response.success) {
      // Assuming 'message' might be an array of strings as per guidelines
      const errorMessage = Array.isArray(response.message) 
        ? response.message[0] 
        : response.message;
      throw new Error(errorMessage || "Gagal mengambil daftar provinsi");
    }

    return response.data || [];
  } catch (error) {
    console.error("[shippingService] getProvinces failed:", error);
    throw error;
  }
}

/**
 * Fetches cities/districts within a specific province.
 */
export async function getCities(provinceId: number): Promise<Region[]> {
  try {
    const res = await apiClient.get(`/shipping/city/${provinceId}`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil kota/kabupaten: HTTP ${res.status}`);
    }

    const response: ApiResponse<Region[]> = await res.json();

    if (!response.success) {
      const errorMessage = Array.isArray(response.message) 
        ? response.message[0] 
        : response.message;
      throw new Error(errorMessage || "Gagal mengambil daftar kota/kabupaten");
    }

    return response.data || [];
  } catch (error) {
    console.error(`[shippingService] getCities failed for provinceId ${provinceId}:`, error);
    throw error;
  }
}

/**
 * Fetches districts within a specific city.
 */
export async function getDistricts(cityId: number): Promise<Region[]> {
  try {
    const res = await apiClient.get(`/shipping/district/${cityId}`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil kecamatan: HTTP ${res.status}`);
    }

    const response: ApiResponse<Region[]> = await res.json();

    if (!response.success) {
      const errorMessage = Array.isArray(response.message) 
        ? response.message[0] 
        : response.message;
      throw new Error(errorMessage || "Gagal mengambil daftar kecamatan");
    }

    return response.data || [];
  } catch (error) {
    console.error(`[shippingService] getDistricts failed for cityId ${cityId}:`, error);
    throw error;
  }
}

/**
 * Fetches subdistricts (and their postal codes) within a specific district.
 */
export async function getSubdistricts(districtId: number): Promise<Subdistrict[]> {
  try {
    const res = await apiClient.get(`/shipping/subdistrict/${districtId}`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil kelurahan: HTTP ${res.status}`);
    }

    const response: ApiResponse<Subdistrict[]> = await res.json();

    if (!response.success) {
      const errorMessage = Array.isArray(response.message) 
        ? response.message[0] 
        : response.message;
      throw new Error(errorMessage || "Gagal mengambil daftar kelurahan");
    }

    return response.data || [];
  } catch (error) {
    console.error(`[shippingService] getSubdistricts failed for districtId ${districtId}:`, error);
    throw error;
  }
}

/**
 * Calculates shipping cost based on origin, destination, weight, and courier.
 * Uses the custom apiClient as this is effectively a dynamic/mutation request.
 */
export async function calculateShippingCost(
  payload: CalculateShippingCostRequest
): Promise<ShippingOption[]> {
  try {
    const response = await apiClient.post(`/shipping/cost`, payload);
    const result: ApiResponse<ShippingOption[]> = await response.json();

    if (!result.success || !result.data) {
      const errorMessage = Array.isArray(result.message) 
        ? result.message[0] 
        : result.message;
      throw new Error(errorMessage || "Gagal menghitung ongkos kirim");
    }

    return result.data;
  } catch (error) {
    console.error(`[shippingService] calculateShippingCost failed:`, error);
    throw error;
  }
}