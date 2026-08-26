import { SettingsView } from "@/features/admin/settings/components/SettingsView";
import { fetchSettings } from "@/features/admin/settings/services/settingService";
import {authOptions} from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

export const dynamic = 'force-dynamic';

/**
 * Server Component for the Admin Settings page.
 * Handles the initial data fetching before rendering the interactive client component.
 */
export default async function AdminSettingsPage() {
    try {
        const session = await getServerSession(authOptions); 
        const token = session?.accessToken 

        if (!token) {
        throw new Error("Sesi telah habis atau token akses tidak ditemukan. Silakan login kembali.");
        }

        // 3. Fetch settings by passing the retrieved JWT token
        const initialSettings = await fetchSettings(token);

        return (
        <div className="page-max-width py-8 px-4 md:px-8">
            <SettingsView initialSettings={initialSettings} />
        </div>
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
        console.error("[AdminSettingsPage] Error loading settings:", errorMessage);

        return (
        <div className="page-max-width py-12 px-4 flex flex-col items-center justify-center text-center">
            <h1 className="text-font-5 font-bold text-[var(--mama-brown)] mb-4">
            Gagal Memuat Pengaturan
            </h1>
            <p className="text-font-2 text-[var(--color-gray)] mb-2">
            Maaf, gagal memverifikasi kredensial atau mengambil konfigurasi toko.
            </p>

            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md border border-red-200 mb-6 max-w-md break-words">
            <strong>Detail Error:</strong> {errorMessage}
            </div>

            <button className="bg-[var(--mama-hot-pink)] text-white px-6 py-2 rounded-md font-medium">
            Muat Ulang
            </button>
        </div>
        );
    }
}