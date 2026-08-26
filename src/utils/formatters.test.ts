import { formatIDR } from "./formatters";

// Node's Intl.NumberFormat for the "id-ID" locale inserts a non-breaking
// space (U+00A0) between the "Rp" symbol and the digits, so we normalize
// whitespace before comparing to keep the assertions readable and stable
// across ICU versions.
const normalize = (str: string) => str.replace(/\s/g, " ");

describe("formatIDR", () => {
  it("formats a number into IDR currency string", () => {
    expect(normalize(formatIDR(15000))).toBe("Rp 15.000");
  });

  it("formats a numeric string into IDR currency string", () => {
    expect(normalize(formatIDR("25000"))).toBe("Rp 25.000");
  });

  it("formats zero correctly", () => {
    expect(normalize(formatIDR(0))).toBe("Rp 0");
  });

  it("rounds fraction digits since maximumFractionDigits is 0", () => {
    expect(normalize(formatIDR(1000.5))).toBe("Rp 1.001");
  });

  it("handles negative numbers", () => {
    expect(formatIDR(-5000)).toContain("5.000");
  });
});
