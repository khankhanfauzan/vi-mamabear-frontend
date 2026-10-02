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
  it("removes a bold-wrapped number without leaving markdown artifacts", () => {
    expect(stripWhatsAppNumbers("Chat admin di **081234567890** ya.")).toBe(
      "Chat admin di ya.",
    );
  });

  it("removes a parenthesized number in the middle of a sentence", () => {
    expect(
      stripWhatsAppNumbers(
        "Segera hubungi dokter atau IGD terdekat, atau hubungi WhatsApp MamaBear (08888695757) untuk bantuan cepat.",
      ),
    ).toBe(
      "Segera hubungi dokter atau IGD terdekat, atau hubungi WhatsApp MamaBear untuk bantuan cepat.",
    );
  });

  it("removes a parenthesized number at the end of a sentence", () => {
    expect(
      stripWhatsAppNumbers(
        "Kondisi ini mengindikasikan darurat medis, segera hubungi dokter/IGD terdekat atau WhatsApp MamaBear (08888695757).",
      ),
    ).toBe(
      "Kondisi ini mengindikasikan darurat medis, segera hubungi dokter/IGD terdekat atau WhatsApp MamaBear.",
    );
  });

  it("removes empty parentheses already present in the text", () => {
    expect(stripWhatsAppNumbers("WhatsApp MamaBear ().")).toBe(
      "WhatsApp MamaBear.",
    );
  });

  it("removes bold numbers inside and outside parentheses", () => {
    expect(
      stripWhatsAppNumbers("Hubungi (**08888695757**) atau **081234567890** ya."),
    ).toBe("Hubungi atau ya.");
  });

  it("removes a number wrapped in square brackets", () => {
    expect(stripWhatsAppNumbers("Hubungi [081234567890] ya.")).toBe(
      "Hubungi ya.",
    );
  });

  it("keeps ordinary parentheses that do not wrap a phone number", () => {
    const text = "Halo Mama (semoga sehat), ada yang bisa dibantu?";
    expect(stripWhatsAppNumbers(text)).toBe(text);
  });
});
