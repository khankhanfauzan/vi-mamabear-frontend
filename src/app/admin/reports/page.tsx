import { ReportDashboard } from "@/features/admin/reports/components/ReportDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan & Analitik | Admin MamaBear",
  description: "Dasbor analitik dan performa toko MamaBear",
};

export default function ReportsPage() {
  return (
    <main className="page-max-width py-8 px-4 sm:px-6 lg:px-8">
      {/* We delegate the rendering entirely to the Client Component 
        which will orchestrate the data fetching using the custom hook 
        and render the charts.
      */}
      <ReportDashboard />
    </main>
  );
}
