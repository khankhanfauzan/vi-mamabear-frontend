import {
  extractWhatsAppNumbers,
  normalizeToWaLink,
  stripWhatsAppNumbers,
} from "./detectWhatsAppNumber";

describe("normalizeToWaLink", () => {
  it.each([
    ["081234567890", "https://wa.me/6281234567890"],
    ["+6281234567890", "https://wa.me/6281234567890"],
    ["6281234567890", "https://wa.me/6281234567890"],
  ])("normalizes %s to %s", (phone, expected) => {
    expect(normalizeToWaLink(phone)).toBe(expected);
  });
});

describe("extractWhatsAppNumbers", () => {
  it("finds 08, +62, and 62 formats", () => {
    const text =
      "Hubungi CS di 081234567890, +6281234567891, atau 6281234567892 ya Ma.";

    expect(extractWhatsAppNumbers(text)).toEqual([
      "081234567890",
      "+6281234567891",
      "6281234567892",
    ]);
  });

  it("returns an empty array when no number exists", () => {
    expect(extractWhatsAppNumbers("Tidak ada nomor di sini.")).toEqual([]);
  });
});

describe("stripWhatsAppNumbers", () => {
  it("removes detected numbers from the markdown text", () => {
    expect(
      stripWhatsAppNumbers("Chat admin di **081234567890** ya."),
    ).toBe("Chat admin di **** ya.");
  });
});
