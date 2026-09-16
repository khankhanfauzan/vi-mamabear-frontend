import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api.types";
import type { ConversationHistory } from "../types/chat.types";
import { parseConversationHistory } from "../utils/parseConversationHistory";

function readErrorMessage(payload: unknown, fallback: string) {
  const record = payload as { message?: string | string[] } | null;
  if (!record?.message) return fallback;
  return Array.isArray(record.message) ? record.message[0] : record.message;
}

export async function getConversationHistory(
  conversationId: string,
): Promise<ConversationHistory> {
  const res = await apiClient.get(
    `/ai/history/${encodeURIComponent(conversationId)}`,
  );

  const payload = (await res.json().catch(() => null)) as
    | ApiResponse<unknown>
    | unknown;

  if (res.status === 401) {
    throw new Error("Masuk dulu untuk melihat riwayat percakapan.");
  }

  if (res.status === 404) {
    throw new Error("Percakapan tidak ditemukan.");
  }

  if (!res.ok) {
    throw new Error(
      readErrorMessage(payload, `Gagal memuat riwayat percakapan (${res.status}).`),
    );
  }

  const envelope = payload as ApiResponse<unknown>;
  if (envelope && typeof envelope === "object" && "success" in envelope) {
    if (!envelope.success) {
      throw new Error(
        readErrorMessage(envelope, "Gagal memuat riwayat percakapan."),
      );
    }
  }

  return parseConversationHistory(payload, conversationId);
}

export const chatService = {
  getConversationHistory,
};
