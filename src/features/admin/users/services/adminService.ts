import {
  AdminUsersBaseResponse,
  AdminUsersInnerData,
  SingleAdminUserResponse,
  AdminUser,
  UserRole,
  AdminUserQueryParams,
  CreateAdminPayload, // Added import
} from "../types/admin.types";
import { getSession } from "next-auth/react";
import { authOptions } from "@/lib/auth"; // Adjust this path to where your authOptions are exported
import { API_BASE_URL } from "@/lib/config";

async function getAuthHeaders(options: RequestInit = {}): Promise<Headers> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let token: string | undefined;

  // Check if we are running in the browser (Client)
  if (typeof window !== "undefined") {
    // We cast to any/custom type if your NextAuth types aren't extended yet to include accessToken
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
        "[adminUserService] Server-side session resolution failed:",
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
 * Fetches the list of admin users from the backend.
 * @param params - Optional query parameters including pagination, search, filters, and sorting
 * @returns Promise resolving to the inner data containing the users array and pagination meta
 */
export async function fetchAdminUsers(params?: AdminUserQueryParams): Promise<AdminUsersInnerData> {
  try {
    const url = new URL(`${API_BASE_URL}/admin/users`);
    
    // Append pagination, filter, and sort queries if provided
    if (params?.page) url.searchParams.append("page", params.page.toString());
    if (params?.limit) url.searchParams.append("limit", params.limit.toString());
    if (params?.search) url.searchParams.append("search", params.search);
    if (params?.role) url.searchParams.append("role", params.role);
    if (params?.isVerified !== undefined) url.searchParams.append("isVerified", params.isVerified.toString());
    if (params?.sortBy) url.searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) url.searchParams.append("sortOrder", params.sortOrder);

    const headers = await getAuthHeaders();

    const res = await fetch(url.toString(), {
      cache: "no-store", 
      headers,
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil data pengguna: HTTP ${res.status}`);
    }

    const response: AdminUsersBaseResponse = await res.json();

    if (!response.success || !response.data) {
      throw new Error(response.message?.[0] || "Gagal mengambil daftar pengguna");
    }

    return response.data;
  } catch (error) {
    console.error("[adminUserService] fetchAdminUsers failed:", error);
    throw error;
  }
}

/**
 * Fetches a single admin user by their ID.
 * @param id - The UUID of the user
 * @returns Promise resolving to the user details
 */
export async function fetchAdminUserById(id: string): Promise<AdminUser> {
  try {
    const url = `${API_BASE_URL}/admin/users/${id}`;
    const headers = await getAuthHeaders();

    const res = await fetch(url, {
      cache: "no-store",
      headers,
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil detail pengguna: HTTP ${res.status}`);
    }

    const response: SingleAdminUserResponse = await res.json();

    if (!response.success || !response.data) {
      throw new Error(response.message?.[0] || "Gagal mengambil detail pengguna");
    }

    return response.data;
  } catch (error) {
    console.error(`[adminUserService] fetchAdminUserById failed for id ${id}:`, error);
    throw error;
  }
}

/**
 * Creates a new admin user.
 * @param payload - The data for the new admin
 * @returns Promise resolving to the created user details
 */
export async function createAdminUser(payload: CreateAdminPayload): Promise<AdminUser> {
  try {
    const url = `${API_BASE_URL}/admin/users`;
    const headers = await getAuthHeaders();

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Gagal membuat pengguna admin: HTTP ${res.status}`);
    }

    const response: SingleAdminUserResponse = await res.json();

    if (!response.success || !response.data) {
      throw new Error(response.message?.[0] || "Gagal membuat pengguna admin");
    }

    return response.data;
  } catch (error) {
    console.error("[adminUserService] createAdminUser failed:", error);
    throw error;
  }
}

/**
 * Deletes an admin user by their ID.
 * @param id - The UUID of the user to delete
 * @returns Promise resolving to a boolean indicating success
 */
export async function deleteAdminUser(id: string): Promise<boolean> {
  try {
    const url = `${API_BASE_URL}/admin/users/${id}`;
    const headers = await getAuthHeaders();

    const res = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error(`Gagal menghapus pengguna: HTTP ${res.status}`);
    }

    const response = await res.json();

    if (!response.success) {
      throw new Error(response.message?.[0] || "Gagal menghapus pengguna");
    }

    return true;
  } catch (error) {
    console.error(`[adminUserService] deleteAdminUser failed for id ${id}:`, error);
    throw error;
  }
}

/**
 * Updates the role of an admin user.
 * @param id - The UUID of the user
 * @param role - The new role ("ADMIN" | "SUPERADMIN" | "USER")
 * @returns Promise resolving to the updated user details
 */
export async function updateAdminUserRole(id: string, role: UserRole): Promise<AdminUser> {
  try {
    const url = `${API_BASE_URL}/admin/users/${id}/role`;
    const headers = await getAuthHeaders();

    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({ role }),
    });

    if (!res.ok) {
      throw new Error(`Gagal memperbarui peran pengguna: HTTP ${res.status}`);
    }

    const response: SingleAdminUserResponse = await res.json();

    if (!response.success || !response.data) {
      throw new Error(response.message?.[0] || "Gagal memperbarui peran pengguna");
    }

    return response.data;
  } catch (error) {
    console.error(`[adminUserService] updateAdminUserRole failed for id ${id}:`, error);
    throw error;
  }
}

/**
 * Updates the block status of an admin user.
 * @param id - The UUID of the user
 * @param isBlocked - Boolean indicating if the user should be blocked
 * @returns Promise resolving to the updated user details
 */
export async function updateAdminUserStatus(id: string, isBlocked: boolean): Promise<AdminUser> {
  try {
    const url = `${API_BASE_URL}/admin/users/${id}/status`;
    const headers = await getAuthHeaders();

    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isBlocked }),
    });

    if (!res.ok) {
      throw new Error(`Gagal memperbarui status blokir pengguna: HTTP ${res.status}`);
    }

    const response: SingleAdminUserResponse = await res.json();

    if (!response.success || !response.data) {
      throw new Error(response.message?.[0] || "Gagal memperbarui status blokir pengguna");
    }

    return response.data;
  } catch (error) {
    console.error(`[adminUserService] updateAdminUserStatus failed for id ${id}:`, error);
    throw error;
  }
}

/**
 * Updates the verification status of an admin user.
 * @param id - The UUID of the user
 * @param isVerified - Boolean indicating if the user should be verified
 * @returns Promise resolving to the updated user details
 */
export async function updateAdminUserVerify(id: string, isVerified: boolean): Promise<AdminUser> {
  try {
    const url = `${API_BASE_URL}/admin/users/${id}/verify`;
    const headers = await getAuthHeaders();

    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isVerified }),
    });

    if (!res.ok) {
      throw new Error(`Gagal memperbarui verifikasi pengguna: HTTP ${res.status}`);
    }

    const response: SingleAdminUserResponse = await res.json();

    if (!response.success || !response.data) {
      throw new Error(response.message?.[0] || "Gagal memperbarui verifikasi pengguna");
    }

    return response.data;
  } catch (error) {
    console.error(`[adminUserService] updateAdminUserVerify failed for id ${id}:`, error);
    throw error;
  }
}