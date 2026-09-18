import { apiClient } from "@/lib/api";
import { chatService, sendChatMessage } from "./chatService";

jest.mock("@/lib/api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("chatService.sendChatMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws an error when message is empty or whitespace", async () => {
    await expect(sendChatMessage("   ")).rejects.toThrow(
      "Pesan tidak boleh kosong.",
    );
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("posts to /ai/chat and returns normalized response", async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          conversationId: "conv-123",
          reply: "Halo Mama! Ada rekomendasi produk.",
          products: [
            {
              id: 1,
              name: "Teh Pelancar ASI Mama Bear",
              slug: "teh-pelancar-asi",
              price: 45000,
              formattedPrice: "Rp 45.000",
            },
          ],
        },
      }),
    });

    const response = await chatService.sendChatMessage("rekomendasi teh", "conv-123");

    expect(apiClient.post).toHaveBeenCalledWith("/ai/chat", {
      message: "rekomendasi teh",
      conversationId: "conv-123",
    });
    expect(response.conversationId).toBe("conv-123");
    expect(response.reply).toBe("Halo Mama! Ada rekomendasi produk.");
    expect(response.products).toHaveLength(1);
    expect(response.products?.[0].name).toBe("Teh Pelancar ASI Mama Bear");
  });

  it("handles un-enveloped payload response", async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        conversationId: "conv-456",
        reply: "Pesan berhasil dijawab.",
      }),
    });

    const response = await sendChatMessage("halo");

    expect(response.conversationId).toBe("conv-456");
    expect(response.reply).toBe("Pesan berhasil dijawab.");
    expect(response.products).toBeUndefined();
  });

  it("throws if API returns non-ok status with custom message", async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        message: "Token AI habis.",
      }),
    });

    await expect(sendChatMessage("halo")).rejects.toThrow("Token AI habis.");
  });
});
