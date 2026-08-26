import { formatIDR } from "./currency";

// Node's Intl.NumberFormat for the "id-ID" locale inserts a non-breaking
// space (U+00A0) between the "Rp" symbol and the digits, so we normalize
// whitespace before comparing to keep the assertions readable and stable
// across ICU versions.
const normalize = (str: string) => str.replace(/\s/g, " ");

describe("lib/currency formatIDR", () => {
  it("formats a positive integer into IDR currency", () => {
    expect(normalize(formatIDR(15000))).toBe("Rp 15.000");
  });

  it("formats zero correctly", () => {
    expect(normalize(formatIDR(0))).toBe("Rp 0");
  });

  it("formats large numbers with thousand separators", () => {
    expect(normalize(formatIDR(1250000))).toBe("Rp 1.250.000");
  });
});
