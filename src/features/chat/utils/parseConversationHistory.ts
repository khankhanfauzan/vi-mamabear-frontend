import type { ChatMessage, ChatRole, ConversationHistory } from "../types/chat.types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function normalizeRole(role: unknown): ChatRole {
  const value = String(role ?? "").toLowerCase();
  if (value === "user" || value === "human" || value === "customer") {
    return "user";
  }
  return "assistant";
}

export function normalizeChatMessage(raw: unknown, index: number): ChatMessage {
  const item = asRecord(raw) ?? {};
  const content = item.content ?? item.message ?? item.text ?? "";

  return {
    id: String(item.id ?? item._id ?? `msg-${index}`),
    role: normalizeRole(item.role ?? item.sender ?? item.from),
    content: String(content),
    createdAt: item.createdAt
      ? String(item.createdAt)
      : item.timestamp
        ? String(item.timestamp)
        : undefined,
  };
}

export function parseConversationHistory(
  payload: unknown,
  fallbackConversationId: string,
): ConversationHistory {
  const root = asRecord(payload);
  const data = (root?.data ?? payload) as unknown;
  const dataRecord = asRecord(data);

  const rawMessages = Array.isArray(data)
    ? data
    : Array.isArray(dataRecord?.messages)
      ? dataRecord.messages
      : Array.isArray(dataRecord?.history)
        ? dataRecord.history
        : Array.isArray(dataRecord?.items)
          ? dataRecord.items
          : [];

  const conversationId = String(
    dataRecord?.conversationId ??
      dataRecord?.id ??
      root?.conversationId ??
      fallbackConversationId,
  );

  return {
    conversationId,
    messages: rawMessages.map(normalizeChatMessage),
  };
}
