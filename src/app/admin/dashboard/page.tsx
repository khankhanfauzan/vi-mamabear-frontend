import { Metadata } from "next";
import { getServerSession } from "next-auth";
import {
  fetchDashboardData,
  fetchSalesReportData,
} from "@/features/admin/dashboard/services/dashboardService";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "@/features/admin/dashboard/components/DashboardClient";

// ----------------------------------------------------------------------
// Metadata
// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Dashboard Admin | MamaBear",
  description: "Ringkasan performa dan penjualan toko MamaBear.",
};

export const dynamic = 'force-dynamic';

// ----------------------------------------------------------------------
// Server Component
// ----------------------------------------------------------------------

export default async function AdminDashboardPage() {
  try {
    const session = await getServerSession(authOptions);

    const accessToken = session?.accessToken;

    const [dashboardData, salesData] = await Promise.all([
      fetchDashboardData(accessToken),
      fetchSalesReportData(accessToken),
    ]);

    return (
      <main className="page-max-width p-4 md:p-8">
        <DashboardClient
          initialDashboardData={dashboardData}
          initialSalesData={salesData}
          accessToken={accessToken}
        />
      </main>
    );
  } catch (error) {
    // In a real application, you might want to return a designated Error Boundary component here
    console.error("Error loading dashboard page:", error);

    return (
      <main className="page-max-width p-4 md:p-8">
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-12 text-center">
          <h2 className="mb-2 text-font-4 font-bold text-red-700">
            Gagal Memuat Dashboard
          </h2>
          <p className="text-font-2 text-red-600">
            Terjadi kesalahan saat mengambil data dari server. Silakan muat
            ulang halaman.
          </p>
        </div>
      </main>
    );
  }
}
