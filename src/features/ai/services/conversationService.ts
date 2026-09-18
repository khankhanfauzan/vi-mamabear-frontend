import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api.types";
import { mockAiConversations } from "@/features/ai/mocks/conversations";
import {
  AiChatRequest,
  AiChatResponse,
  AiConversation,
  AiConversationHistoryResult,
} from "@/features/ai/types/conversation.types";

const endpointUnavailableStatuses = new Set([404, 501]);

export async function fetchAiConversations(): Promise<AiConversationHistoryResult> {
  try {
    const res = await apiClient.get("/ai/conversations");

    if (endpointUnavailableStatuses.has(res.status)) {
      return {
        conversations: mockAiConversations,
        isMock: true,
      };
    }

    const payload = await parseJsonResponse(res);

    if (!res.ok) {
      throw new Error(
        readResponseMessage(payload) || "Gagal memuat riwayat percakapan.",
      );
    }

    const data = unwrapApiData(payload, "Gagal memuat riwayat percakapan.");

    return {
      conversations: normalizeConversations(data),
      isMock: false,
    };
  } catch (error) {
    console.error("[conversationService] fetchAiConversations failed:", error);
    throw error instanceof Error
      ? error
      : new Error("Gagal memuat riwayat percakapan.");
  }
}

export async function sendAiChatMessage(
  message: string,
  conversationId?: string,
): Promise<AiChatResponse> {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    throw new Error("Pesan tidak boleh kosong.");
  }

  const requestBody: AiChatRequest = {
    message: trimmedMessage,
    ...(conversationId ? { conversationId } : {}),
  };

  try {
    const res = await apiClient.post("/ai/chat", requestBody);
    const payload = await parseJsonResponse(res);

    if (!res.ok) {
      throw new Error(
        readResponseMessage(payload) || "Gagal mengirim pesan ke AI.",
      );
    }

    const data = unwrapApiData(payload, "Gagal mengirim pesan ke AI.");
    const chatResponse = normalizeChatResponse(data);

    if (!chatResponse) {
      throw new Error("Response AI tidak sesuai format yang diharapkan.");
    }

    return chatResponse;
  } catch (error) {
    console.error("[conversationService] sendAiChatMessage failed:", error);
    throw error instanceof Error
      ? error
      : new Error("Gagal mengirim pesan ke AI.");
  }
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function unwrapApiData(payload: unknown, fallbackMessage: string): unknown {
  const body = toRecord(payload);

  if (!body) {
    return payload;
  }

  if (body.success === false) {
    throw new Error(readResponseMessage(payload) || fallbackMessage);
  }

  return "data" in body ? (payload as ApiResponse<unknown>).data : payload;
}

function normalizeConversations(payload: unknown): AiConversation[] {
  const conversations = extractConversationArray(payload);

  return conversations
    .map((conversation) => normalizeConversation(conversation))
    .filter((conversation): conversation is AiConversation => Boolean(conversation));
}

function extractConversationArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const body = toRecord(payload);

  if (!body) {
    return [];
  }

  const possibleArrays = [body.conversations, body.items, body.data];
  const matchedArray = possibleArrays.find(Array.isArray);

  return matchedArray ?? [];
}

function normalizeConversation(payload: unknown): AiConversation | null {
  const body = toRecord(payload);

  if (!body) {
    return null;
  }

  const id = firstString(body.id, body.conversationId, body.threadId);

  if (!id) {
    return null;
  }

  const lastMessage = toRecord(body.lastMessage);
  const preview = firstString(
    body.preview,
    body.lastMessageContent,
    body.message,
    body.content,
    lastMessage?.content,
    lastMessage?.message,
  );

  return {
    id,
    title: firstString(body.title, body.name, body.summary),
    preview,
    createdAt: firstString(body.createdAt, body.created_at),
    updatedAt: firstString(body.updatedAt, body.updated_at, body.lastMessageAt),
  };
}

function normalizeChatResponse(payload: unknown): AiChatResponse | null {
  const body = toRecord(payload);

  if (!body) {
    return null;
  }

  const conversationId = firstString(
    body.conversationId,
    body.id,
    body.threadId,
  );
  const reply = firstString(
    body.reply,
    body.message,
    body.content,
    body.answer,
    body.response,
  );

  if (!conversationId || !reply) {
    return null;
  }

  return {
    conversationId,
    reply,
  };
}

function readResponseMessage(payload: unknown): string | null {
  const body = toRecord(payload);

  if (!body) {
    return null;
  }

  const message = body.message;

  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.filter((item) => typeof item === "string").join(", ");
  }

  return null;
}

function firstString(...values: unknown[]): string | null {
  const value = values.find(
    (item) => typeof item === "string" && item.trim().length > 0,
  );

  return typeof value === "string" ? value : null;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}
