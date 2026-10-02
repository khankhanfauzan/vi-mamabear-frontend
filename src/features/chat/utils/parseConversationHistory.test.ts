import { parseConversationHistory } from "./parseConversationHistory";

describe("parseConversationHistory", () => {
  it("reads messages from ApiResponse.data.messages", () => {
    const result = parseConversationHistory(
      {
        success: true,
        data: {
          conversationId: "conv-1",
          messages: [
            { id: "1", role: "USER", content: "Halo" },
            { id: "2", role: "assistant", message: "Hai Mama" },
          ],
        },
      },
      "fallback",
    );

    expect(result.conversationId).toBe("conv-1");
    expect(result.messages).toEqual([
      { id: "1", role: "user", content: "Halo", createdAt: undefined, products: undefined },
      { id: "2", role: "assistant", content: "Hai Mama", createdAt: undefined, products: undefined },
    ]);
  });

  it("reads a bare message array from data", () => {
    const result = parseConversationHistory(
      {
        data: [{ id: "a", sender: "human", text: "Tanya stok" }],
      },
      "conv-2",
    );

    expect(result.conversationId).toBe("conv-2");
    expect(result.messages[0]).toMatchObject({
      id: "a",
      role: "user",
      content: "Tanya stok",
    });
  });

  it("attaches products from an assistant payload", () => {
    const result = parseConversationHistory(
      {
        success: true,
        data: {
          conversationId: "conv-3",
          messages: [
            {
              id: "2",
              role: "assistant",
              reply:
                "Pilihan tepat sekali, Ma! Untuk camilan lezat bernutrisi tinggi, Mama Bear punya rekomendasi favorit para busui:",
              products: [
                {
                  id: 1,
                  name: "Kukis Almond Oat Mama Bear",
                  slug: "kukis-almond-oat-mama-bear",
                  category: "SUPERFOOD CAMILAN",
                  imageUrl: "https://res.cloudinary.com/demo/kukis.jpg",
                  price: 35000,
                  formattedPrice: "Rp 35.000",
                  rating: 4.9,
                  reviewCount: 14200,
                  totalSold: 500000,
                  shortDescription:
                    "Kaya serat & almond superfood untuk melancarkan ASI",
                },
              ],
            },
          ],
        },
      },
      "fallback",
    );

    expect(result.messages[0].content).toContain("Pilihan tepat sekali");
    expect(result.messages[0].products).toHaveLength(1);
    expect(result.messages[0].products?.[0]).toMatchObject({
      id: 1,
      slug: "kukis-almond-oat-mama-bear",
      formattedPrice: "Rp 35.000",
    });
  });

  it("keeps the clarification type from history so the badge survives a reload", () => {
    const result = parseConversationHistory(
      {
        success: true,
        data: {
          conversationId: "conv-4",
          messages: [
            {
              id: "1",
              role: "user",
              content: "rekomendasiin dong",
            },
            {
              id: "2",
              role: "assistant",
              reply:
                "Boleh cerita dulu, Ma, lagi cari produk untuk kebutuhan apa?",
              products: [],
              type: "clarification",
            },
          ],
        },
      },
      "fallback",
    );

    expect(result.messages[1].type).toBe("clarification");
    expect(result.messages[1].products).toBeUndefined();
    expect(result.messages[0].type).toBeUndefined();
  });

  it("leaves type undefined for legacy history messages without the field", () => {
    const result = parseConversationHistory(
      {
        data: {
          conversationId: "conv-5",
          messages: [
            { id: "1", role: "assistant", reply: "Halo Ma!", type: "answer" },
            { id: "2", role: "assistant", reply: "Halo Ma!" },
          ],
        },
      },
      "fallback",
    );

    expect(result.messages[0].type).toBe("answer");
    expect(result.messages[1].type).toBeUndefined();
  });
});
