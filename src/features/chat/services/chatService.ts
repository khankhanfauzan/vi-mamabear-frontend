import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types/api.types";
import {
  CONVERSATION_STORAGE_KEY,
  type ConversationHistory,
  type SendChatMessageResponse,
} from "../types/chat.types";
import {
  normalizeChatProducts,
  parseConversationHistory,
} from "../utils/parseConversationHistory";

export class ConversationNotFoundError extends Error {
  constructor(message = "Percakapan tidak ditemukan.") {
    super(message);
    this.name = "ConversationNotFoundError";
    Object.setPrototypeOf(this, ConversationNotFoundError.prototype);
  }
}

const OPAQUE_ERROR_SIGNATURES = ["prismaclient", "internal server error"];

function readErrorMessage(payload: unknown, fallback: string) {
  const record = payload as { message?: string | string[] } | null;
  const raw = Array.isArray(record?.message) ? record.message[0] : record?.message;
  if (typeof raw !== "string" || raw.trim().length === 0) return fallback;
  return raw;
}

function isOpaqueErrorMessage(message: string) {
  const normalized = message.trim().toLowerCase();
  return OPAQUE_ERROR_SIGNATURES.some((signature) =>
    normalized.includes(signature),
  );
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

  const errorMessage = readErrorMessage(payload, "");
  const normalizedMessage = errorMessage.trim().toLowerCase();
  const isNotFound =
    res.status === 404 ||
    (res.status < 500 &&
      (normalizedMessage.includes("tidak ditemukan") ||
        normalizedMessage.includes("not found")));

  if (isNotFound) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CONVERSATION_STORAGE_KEY);
    }
    throw new ConversationNotFoundError();
  }

  if (!res.ok) {
    const isServerFault =
      res.status >= 500 || isOpaqueErrorMessage(errorMessage);
    throw new Error(
      isServerFault
        ? "Gagal memuat riwayat percakapan. Silakan coba lagi sebentar ya."
        : readErrorMessage(
            payload,
            `Gagal memuat riwayat percakapan (${res.status}).`,
          ),
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

export async function sendChatMessage(
  message: string,
  conversationId?: string | null,
): Promise<SendChatMessageResponse> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error("Pesan tidak boleh kosong.");
  }

  const body: { message: string; conversationId?: string } = {
    message: trimmed,
    ...(conversationId ? { conversationId } : {}),
  };

  const res = await apiClient.post("/ai/chat", body);
  const payload = (await res.json().catch(() => null)) as
    | ApiResponse<unknown>
    | unknown;

  if (!res.ok) {
    throw new Error(
      readErrorMessage(payload, `Gagal mengirim pesan ke AI (${res.status}).`),
    );
  }

  const envelope = payload as ApiResponse<unknown>;
  if (envelope && typeof envelope === "object" && "success" in envelope) {
    if (!envelope.success) {
      throw new Error(
        readErrorMessage(envelope, "Gagal mengirim pesan ke AI."),
      );
    }
  }

  const root = (payload && typeof payload === "object" ? payload : {}) as Record<
    string,
    unknown
  >;
  const data = (root.data ?? payload) as Record<string, unknown> | null;
  const target = data && typeof data === "object" ? data : root;

  const convId = String(
    target.conversationId ??
      target.id ??
      target.threadId ??
      conversationId ??
      "",
  );

  const reply = String(
    target.reply ??
      target.message ??
      target.content ??
      target.answer ??
      target.response ??
      "",
  );

  if (!reply) {
    throw new Error("Response AI tidak sesuai format yang diharapkan.");
  }

  const rawProducts = target.products ?? target.recommendations;
  const products = normalizeChatProducts(rawProducts);

  return {
    conversationId: convId || conversationId || `conv-${Date.now()}`,
    reply,
    products,
  };
}

export const chatService = {
  getConversationHistory,
  sendChatMessage,
};
