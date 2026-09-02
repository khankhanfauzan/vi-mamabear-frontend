import { formatRupiah, formatDate, getStatusConfig } from "./orderFormatting";

// Node's Intl.NumberFormat for the "id-ID" locale inserts a non-breaking
// space (U+00A0) between the "Rp" symbol and the digits, so we normalize
// whitespace before comparing to keep the assertions readable and stable
// across ICU versions.
const normalize = (str: string) => str.replace(/\s/g, " ");

describe("formatRupiah", () => {
  it("formats a positive number as IDR currency", () => {
    expect(normalize(formatRupiah(50000))).toBe("Rp 50.000");
  });

  it("formats zero correctly", () => {
    expect(normalize(formatRupiah(0))).toBe("Rp 0");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string using the id-ID locale with a bullet separator", () => {
    const result = formatDate("2026-05-14T14:00:00.000Z");
    // The exact time portion depends on the runtime timezone, but the format
    // should always replace the comma with a bullet point separator.
    expect(result).not.toContain(",");
    expect(result).toContain("•");
    expect(result).toContain("2026");
  });
});

describe("getStatusConfig", () => {
  it("returns the correct config for PAYMENT_PENDING", () => {
    expect(getStatusConfig("PAYMENT_PENDING")).toEqual({
      label: "Menunggu Pembayaran",
      badge: "bg-red-600 text-white",
      footer: "bg-red-600 text-white",
    });
  });

  it("returns the correct config for COMPLETED", () => {
    expect(getStatusConfig("COMPLETED")).toEqual({
      label: "Selesai",
      badge: "bg-[var(--mama-brown)] text-white",
      footer: "bg-[var(--mama-brown)] text-white",
    });
  });

  it("returns the correct config for CANCELLED", () => {
    expect(getStatusConfig("CANCELLED")).toEqual({
      label: "Dibatalkan",
      badge: "bg-[var(--color-gray)] text-white",
      footer: "bg-[var(--color-gray)] text-white",
    });
  });

  it("maps lowercase and alias statuses to the same labels", () => {
    expect(getStatusConfig("pending").label).toBe("Menunggu Pembayaran");
    expect(getStatusConfig("payment-pending").label).toBe(
      "Menunggu Pembayaran",
    );
    expect(getStatusConfig("cancelled").label).toBe("Dibatalkan");
  });

  it("falls back to a default config for unknown statuses", () => {
    expect(getStatusConfig("SOME_UNKNOWN_STATUS")).toEqual({
      label: "SOME_UNKNOWN_STATUS",
      badge: "bg-gray-200 text-gray-800",
      footer: "bg-gray-200 text-gray-800",
    });
  });
});
