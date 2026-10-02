import { apiClient } from "@/lib/api";
import {
  chatService,
  ConversationNotFoundError,
  sendChatMessage,
} from "./chatService";

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
    expect(response.type).toBeUndefined();
  });

  it("returns type clarification and no products for an ambiguous message", async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "Pesan berhasil diproses",
        data: {
          conversationId: "conv-clarification",
          reply:
            "Boleh cerita dulu, Ma, lagi cari produk untuk kebutuhan apa? Misalnya pelancar ASI, nutrisi kehamilan, atau camilan sehat?",
          products: [],
          blocked: false,
          type: "clarification",
        },
      }),
    });

    const response = await sendChatMessage("rekomendasiin dong", "conv-clarification");

    expect(response.type).toBe("clarification");
    expect(response.products).toBeUndefined();
    expect(response.reply).toContain("Boleh cerita dulu");
  });

  it("returns type answer when the message is specific", async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          conversationId: "conv-answer",
          reply: "Halo Ma! Mama Bear punya pompa ASI elektrik.",
          products: [
            {
              id: 7,
              name: "MamaBear Electric Pump",
              slug: "mamabear-electric-pump",
              formattedPrice: "Rp 450.000",
            },
          ],
          type: "answer",
        },
      }),
    });

    const response = await sendChatMessage("ada pompa ASI elektrik ga?", "conv-answer");

    expect(response.type).toBe("answer");
    expect(response.products).toHaveLength(1);
  });

  it("ignores an unknown type value instead of surfacing it", async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          conversationId: "conv-weird",
          reply: "Halo Ma!",
          type: "something-new",
        },
      }),
    });

    const response = await sendChatMessage("halo");

    expect(response.type).toBeUndefined();
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

describe("chatService.getConversationHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("throws ConversationNotFoundError and clears localStorage on 404", async () => {
    localStorage.setItem("mamabear-conversation-id", "test-conv-id");

    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        statusCode: 404,
        message: "Percakapan tidak ditemukan.",
      }),
    });

    const request = chatService.getConversationHistory("test-conv-id");

    await expect(request).rejects.toBeInstanceOf(ConversationNotFoundError);
    await expect(request).rejects.toThrow("Percakapan tidak ditemukan.");

    expect(localStorage.getItem("mamabear-conversation-id")).toBeNull();
  });

  it("treats a 4xx 'not found' message as a missing conversation", async () => {
    localStorage.setItem("mamabear-conversation-id", "test-conv-id");

    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ statusCode: 400, message: "Conversation not found" }),
    });

    await expect(
      chatService.getConversationHistory("test-conv-id"),
    ).rejects.toBeInstanceOf(ConversationNotFoundError);

    expect(localStorage.getItem("mamabear-conversation-id")).toBeNull();
  });

  it("hides raw Prisma internals behind a friendly message on 5xx", async () => {
    localStorage.setItem("mamabear-conversation-id", "stale-conv-id");

    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        statusCode: 500,
        message: ["PrismaClientKnownRequestError"],
        data: null,
      }),
    });

    await expect(
      chatService.getConversationHistory("stale-conv-id"),
    ).rejects.toThrow(
      "Gagal memuat riwayat percakapan. Silakan coba lagi sebentar ya.",
    );

    expect(localStorage.getItem("mamabear-conversation-id")).toBe(
      "stale-conv-id",
    );
  });

  it("does not treat a 5xx 'not found' message as a missing conversation", async () => {
    localStorage.setItem("mamabear-conversation-id", "stale-conv-id");

    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ statusCode: 500, message: "Model not found" }),
    });

    await expect(
      chatService.getConversationHistory("stale-conv-id"),
    ).rejects.toThrow(
      "Gagal memuat riwayat percakapan. Silakan coba lagi sebentar ya.",
    );

    expect(localStorage.getItem("mamabear-conversation-id")).toBe(
      "stale-conv-id",
    );
  });

  it("keeps surfacing readable messages from 4xx responses", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ statusCode: 403, message: ["Akses ditolak."] }),
    });

    await expect(
      chatService.getConversationHistory("test-conv-id"),
    ).rejects.toThrow("Akses ditolak.");
  });

  it("requests history for the given conversation id", async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: { conversationId: "conv-1", messages: [] },
      }),
    });

    const history = await chatService.getConversationHistory("conv 1");

    expect(apiClient.get).toHaveBeenCalledWith("/ai/history/conv%201");
    expect(history.messages).toEqual([]);
  });
});
