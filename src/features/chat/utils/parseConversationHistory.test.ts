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
      { id: "1", role: "user", content: "Halo", createdAt: undefined },
      { id: "2", role: "assistant", content: "Hai Mama", createdAt: undefined },
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
});
