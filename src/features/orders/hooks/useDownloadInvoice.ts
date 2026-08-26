import { useState } from "react";
import { orderService } from "../services/orderService";
import { formatRupiah } from "../utils/orderFormatting";
import jsPDF from "jspdf"; // Tambahkan package ini: npm install jspdf

/**
 * Hook to manage downloading the invoice.
 * Fetches the invoice data and generates a downloadable PDF file.
 */
export function useDownloadInvoice() {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async (orderId: string) => {
    setIsDownloading(true);
    try {
      // 1. Fetch data dari service
      const invoice = await orderService.getInvoice(orderId);
      
      // 2. Format tanggal
      const dateStr = new Date(invoice.issuedAt).toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric' 
      });

      // 3. Inisialisasi dokumen PDF dan susun layout
      const doc = new jsPDF();
      let currentY = 20;
      const leftMargin = 14;

      // Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("MAMABEAR INVOICE", leftMargin, currentY);
      currentY += 10;

      // Info Transaksi
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`No. Invoice : ${invoice.invoiceNumber}`, leftMargin, currentY);
      currentY += 6;
      doc.text(`Tanggal     : ${dateStr}`, leftMargin, currentY);
      currentY += 6;
      doc.text(`Status      : ${invoice.InvoicePaymentStatus}`, leftMargin, currentY);
      currentY += 6;
      doc.text(`Metode      : ${invoice.PaymentMethod || "N/A"}`, leftMargin, currentY);
      currentY += 10;

      // Alamat Pengiriman
      doc.setFont("helvetica", "bold");
      doc.text("Alamat Pengiriman:", leftMargin, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      
      // Memecah teks alamat jika terlalu panjang agar tidak terpotong
      const addressLines = doc.splitTextToSize(invoice.ShippingAddress, 180);
      doc.text(addressLines, leftMargin, currentY);
      currentY += (addressLines.length * 6) + 4;

      // Garis pemisah
      doc.setLineWidth(0.5);
      doc.line(leftMargin, currentY, 196, currentY);
      currentY += 8;

      // Daftar Produk
      doc.setFont("helvetica", "bold");
      doc.text("Daftar Produk:", leftMargin, currentY);
      currentY += 8;
      doc.setFont("helvetica", "normal");

      invoice.OrderedItem.forEach((item) => {
         doc.text(`- ${item.productName}`, leftMargin, currentY);
         currentY += 6;
         doc.text(`  Varian: ${item.variantName}`, leftMargin, currentY);
         currentY += 6;
         doc.text(`  ${item.quantity} x ${formatRupiah(Number(item.price))}`, leftMargin, currentY);
         currentY += 8;
      });

      doc.line(leftMargin, currentY, 196, currentY);
      currentY += 8;

      // Ringkasan Harga
      doc.text(`Subtotal    : ${formatRupiah(Number(invoice.subtotalIdr))}`, leftMargin, currentY);
      currentY += 6;
      doc.text(`Ongkos Kirim: ${formatRupiah(Number(invoice.shippingCostIdr))}`, leftMargin, currentY);
      currentY += 8;

      // Total Akhir
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`TOTAL       : ${formatRupiah(Number(invoice.totalIdr))}`, leftMargin, currentY);
      currentY += 12;

      // Footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text("Terima kasih telah berbelanja di MamaBear!", leftMargin, currentY);

      // 4. Unduh file PDF secara otomatis
      doc.save(`${invoice.invoiceNumber}.pdf`);
      
    } catch (error) {
      console.error("Gagal mengunduh invoice:", error);
      // Fallback alert jika gagal, idealnya diganti dengan toast notification
      alert(error instanceof Error ? error.message : "Gagal mengunduh invoice. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading };
}