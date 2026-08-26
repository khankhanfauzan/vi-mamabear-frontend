import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api.types"; // Adjust import path based on your global types
import { API_BASE_URL } from "@/lib/config";
import { Address } from "../types/address.types"; // Assuming the Address model is exported here


/**
 * Fetches all saved addresses for the current logged-in user.
 * Uses no-store to ensure user data is always fresh.
 */
export async function getAddresses(token: string): Promise<Address[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/me/addresses`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil daftar alamat: HTTP ${res.status}`);
    }

    const response: ApiResponse<Address[]> = await res.json();

    if (!response.success) {
      const errorMessage = Array.isArray(response.message)
        ? response.message[0]
        : response.message;
      throw new Error(errorMessage || "Gagal mengambil daftar alamat");
    }

    return response.data || [];
  } catch (error) {
    console.error("[addressService] getAddresses failed:", error);
    throw error;
  }
}


/**
 * Fetches a specific address by its ID.
 */
export async function getAddressById(id: number, token: string): Promise<Address> {
  try {
    const res = await fetch(`${API_BASE_URL}/me/addresses/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil detail alamat: HTTP ${res.status}`);
    }

    const response: ApiResponse<Address> = await res.json();

    if (!response.success || !response.data) {
      const errorMessage = Array.isArray(response.message)
        ? response.message[0]
        : response.message;
      throw new Error(errorMessage || "Gagal mengambil detail alamat");
    }

    return response.data;
  } catch (error) {
    console.error(`[addressService] getAddressById failed for id ${id}:`, error);
    throw error;
  }
}


/**
 * Creates a new address for the current user.
 * We use Partial<Address> to omit server-generated fields like id and userId.
 */
export async function createAddress(
  addressData: Partial<Address>
): Promise<Address> {
  try {
    const response = await apiClient.post(`/me/addresses`, addressData);
    const result: ApiResponse<Address> = await response.json();

    if (!result.success || !result.data) {
      const errorMessage = Array.isArray(result.message)
        ? result.message[0]
        : result.message;
      throw new Error(errorMessage || "Gagal membuat alamat baru");
    }

    return result.data;
  } catch (error) {
    console.error(`[addressService] createAddress failed:`, error);
    throw error;
  }
}


/**
 * Updates an existing address by its ID.
 */
export async function updateAddress(
  id: number,
  addressData: Partial<Address>
): Promise<Address> {
  try {
    const response = await apiClient.put(`/me/addresses/${id}`, addressData);
    const result: ApiResponse<Address> = await response.json();

    if (!result.success || !result.data) {
      const errorMessage = Array.isArray(result.message)
        ? result.message[0]
        : result.message;
      throw new Error(errorMessage || "Gagal memperbarui alamat");
    }

    return result.data;
  } catch (error) {
    console.error(`[addressService] updateAddress failed for id ${id}:`, error);
    throw error;
  }
}


/**
 * Deletes an existing address by its ID.
 */
export async function deleteAddress(id: number): Promise<boolean> {
  try {
    const response = await apiClient.delete(`/me/addresses/${id}`);
    const result: ApiResponse<null> = await response.json();

    if (!result.success) {
      const errorMessage = Array.isArray(result.message)
        ? result.message[0]
        : result.message;
      throw new Error(errorMessage || "Gagal menghapus alamat");
    }

    return true;
  } catch (error) {
    console.error(`[addressService] deleteAddress failed for id ${id}:`, error);
    throw error;
  }
}