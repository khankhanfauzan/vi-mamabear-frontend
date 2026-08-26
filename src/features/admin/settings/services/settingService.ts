import { Setting } from "@/features/admin/settings/types/setting.types";
import { ApiResponse } from "@/types/api.types";
import { apiClient } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

/**
 * Fetches all admin settings.
 * @param {string} token Optional JWT access token for server-side fetching.
 * @returns {Promise<Setting[]>} An array of setting objects.
 */
export async function fetchSettings(token?: string): Promise<Setting[]> {
    try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        cache: "no-store",
        headers,
        });

        if (!res.ok) {
        if (res.status === 401)
            throw new Error("Unauthorized: Akses ditolak (401)");
        throw new Error(`Failed to fetch settings: HTTP ${res.status}`);
        }

        const response: ApiResponse<Setting[]> = await res.json();

        if (!response.success) {
        const errorMessage = response.message || "Failed to fetch settings list";
        throw new Error(errorMessage);
        }

        return response.data || [];
    } catch (error) {
        console.error("[settingService] fetchSettings failed:", error);
        throw error;
    }
}

/**
 * Fetches a specific admin setting by its key.
 * @param {string} key The setting key (e.g., 'site.name')
 * @param {string} token Optional JWT access token.
 * @returns {Promise<Setting | null>} The setting object or null if not found.
 */
export async function fetchSettingByKey(
    key: string,
    token?: string,
): Promise<Setting | null> {
    try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/admin/settings/${key}`, {
            cache: "no-store",
            headers,
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            if (res.status === 401)
            throw new Error("Unauthorized: Akses ditolak (401)");
            throw new Error(`Failed to fetch setting ${key}: HTTP ${res.status}`);
        }

        const response: ApiResponse<Setting> = await res.json();

        if (!response.success) {
            const errorMessage = response.message || `Failed to fetch setting ${key}`;
            throw new Error(String(errorMessage));
        }

        return response.data || null;
    } catch (error) {
        console.error(
            `[settingService] fetchSettingByKey failed for ${key}:`,
            error,
        );
        throw error;
    }
}

/**
 * Updates a specific admin setting by its key.
 * (Note: Called from Client Components, your apiClient should ideally intercept and attach the JWT automatically).
 */
export async function updateSettingByKey(
    key: string,
    value: string,
): Promise<Setting> {
    try {
        const response = await apiClient.put(`/admin/settings/${key}`, {
            value,
        });
        const result: ApiResponse<Setting> = await response.json();

        if (!result.success || !result.data) {
            const errorMessage = result.message || `Failed to update setting ${key}`;
            throw new Error(String(errorMessage));
        }

        return result.data;
    } catch (error) {
        console.error(
            `[settingService] updateSettingByKey failed for ${key}:`,
            error,
        );
        throw error;
    }
}
