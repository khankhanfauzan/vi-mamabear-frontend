import { getSession } from "next-auth/react";
import {
  CustomerQueryFilters,
  CustomersPayload,
  Customer,
  CustomerDetail,
} from "../types/customer.types";
import { apiClient } from "@/lib/api"; // Imported custom apiClient for mutations
import { authOptions } from "@/lib/auth";
import { ApiResponse } from "@/types/api.types";
import { API_BASE_URL } from "@/lib/config";

/**
 * Resolves authentication headers dynamically depending on the current environment (Server or Client).
 * Extracts the NextAuth accessToken to send as a Bearer header to the external backend.
 */
async function getAuthHeaders(options: RequestInit = {}): Promise<Headers> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let token: string | undefined;

  // Check if we are running in the browser (Client)
  if (typeof window !== "undefined") {
    const session = await getSession();
    token = session?.accessToken;
  } else {
    // Server-Side: Extract token using NextAuth's getServerSession
    try {
      const { getServerSession } = await import("next-auth/next");
      const session = await getServerSession(authOptions);
      token = session?.accessToken;
    } catch (e) {
      console.warn(
        "[customerService] Server-side session resolution failed:",
        e,
      );
    }
  }

  // Attach the token as a Bearer header
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

/**
 * Fetches a paginated and filtered list of customers for admin overview.
 * @param filters Query parameters to filter, paginate, and sort the list.
 * @param options RequestInit options to override Next.js caching or revalidation rules.
 * @returns Promise containing the paginated customers data payload.
 */
export async function fetchAdminCustomers(
  filters: CustomerQueryFilters = {},
  options: RequestInit = {},
): Promise<CustomersPayload> {
  try {
    const searchParams = new URLSearchParams();

    if (filters.page !== undefined) {
      searchParams.append("page", String(filters.page));
    }
    if (filters.limit !== undefined) {
      searchParams.append("limit", String(filters.limit));
    }
    if (filters.search) {
      searchParams.append("search", filters.search);
    }
    if (filters.isBlocked !== undefined) {
      searchParams.append("isBlocked", String(filters.isBlocked));
    }
    if (filters.sortBy) {
      searchParams.append("sortBy", filters.sortBy);
    }
    if (filters.sortOrder) {
      searchParams.append("sortOrder", filters.sortOrder);
    }

    const queryStr = searchParams.toString();
    const endpoint = `${API_BASE_URL}/admin/customers${queryStr ? `?${queryStr}` : ""}`;

    // Resolve secure auth/cookie headers for native fetch
    const authenticatedHeaders = await getAuthHeaders(options);

    const res = await fetch(endpoint, {
      cache: "no-store",
      ...options,
      headers: authenticatedHeaders,
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil data pelanggan: HTTP ${res.status}`);
    }

    const response = (await res.json()) as ApiResponse<CustomersPayload>;

    if (!response.success || !response.data) {
      const errorMessage =
        response.message || "Gagal mengambil daftar pelanggan";
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    console.error("[customerService] fetchAdminCustomers failed:", error);
    throw error;
  }
}

/**
 * Fetches a single customer's detailed profiles, order history, and addresses by ID.
 * @param userId Unique identifier for the customer.
 * @param options RequestInit options to override Next.js caching or headers.
 * @returns Promise containing the customer detail payload.
 */
export async function fetchAdminCustomerById(
  userId: string,
  options: RequestInit = {},
): Promise<CustomerDetail> {
  try {
    if (!userId) {
      throw new Error("ID Pelanggan tidak boleh kosong");
    }

    const endpoint = `${API_BASE_URL}/admin/customers/${userId}`;
    const authenticatedHeaders = await getAuthHeaders(options);

    const res = await fetch(endpoint, {
      cache: "no-store",
      ...options,
      headers: authenticatedHeaders,
    });

    if (!res.ok) {
      throw new Error(
        `Gagal mengambil data detail pelanggan: HTTP ${res.status}`,
      );
    }

    const response = (await res.json()) as ApiResponse<CustomerDetail>;

    if (!response.success || !response.data) {
      const errorMessage =
        response.message || "Gagal mengambil detail pelanggan";
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    console.error(
      `[customerService] fetchAdminCustomerById failed for ID ${userId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Exports the admin customers list as a raw CSV file (Blob) without query filters.
 * @param options RequestInit options to override headers or settings.
 * @returns Promise containing the raw file blob.
 */
export async function exportAdminCustomers(
  options: RequestInit = {},
): Promise<Blob> {
  try {
    const endpoint = `${API_BASE_URL}/admin/customers/export`;

    const authenticatedHeaders = await getAuthHeaders(options);
    authenticatedHeaders.set("Accept", "text/csv");

    const res = await fetch(endpoint, {
      cache: "no-store",
      ...options,
      headers: authenticatedHeaders,
    });

    if (!res.ok) {
      throw new Error(`Gagal mengekspor data pelanggan: HTTP ${res.status}`);
    }

    const blob = await res.blob();
    return new Blob([blob], { type: "text/csv;charset=utf-8;" });
  } catch (error) {
    console.error("[customerService] exportAdminCustomers failed:", error);
    throw error;
  }
}

/**
 * Updates a customer's verification status (isVerified).
 * @param userId Unique identifier for the customer.
 * @param isVerified Boolean payload stating target verification status.
 * @param options RequestInit options to override defaults.
 * @returns Promise resolving to the updated Customer.
 */
export async function updateCustomerStatus(
  userId: string,
  isBlocked: boolean,
  options: RequestInit = {},
): Promise<Customer> {
  try {
    if (!userId) {
      throw new Error("ID Pelanggan tidak boleh kosong");
    }

    const endpoint = `/admin/customers/${userId}/status`;
    const res = await apiClient.put(endpoint, { isBlocked }, options);

    if (!res.ok) {
      throw new Error(
        `Gagal mengambil data detail pelanggan: HTTP ${res.status}`,
      );
    }

    const response = (await res.json()) as ApiResponse<Customer>;

    if (!response.success || !response.data) {
      const errorMessage =
        response.message || "Gagal memperbarui status pelanggan";
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    console.error(
      `[customerService] updateCustomerStatus failed for ID ${userId}:`,
      error,
    );
    throw error;
  }
}
