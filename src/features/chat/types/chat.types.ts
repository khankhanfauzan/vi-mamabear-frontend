export type ChatRole = "user" | "assistant";

/**
 * Jenis respons AI dari POST /ai/chat.
 * - "clarification" → AI butuh info lebih, balik tanya ke user
 * - "answer"        → AI menjawab langsung
 * - undefined       → response lama / history yang belum menyimpan type,
 *                     diperlakukan sama seperti "answer"
 */
export type ChatResponseType = "clarification" | "answer";

export type ChatProduct = {
  id: number | string;
  name: string;
  slug: string;
  category?: string;
  imageUrl?: string;
  price?: number;
  formattedPrice?: string;
  rating?: number;
  reviewCount?: number;
  totalSold?: number;
  shortDescription?: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt?: string;
  products?: ChatProduct[];
  type?: ChatResponseType;
};

export type ConversationHistory = {
  conversationId: string;
  messages: ChatMessage[];
};

export interface SendChatMessageResponse {
  conversationId: string;
  reply: string;
  products?: ChatProduct[];
  /**
   * Field baru pada API. Opsional karena response lama tidak memilikinya,
   * jadi `undefined` harus diperlakukan sebagai "answer".
   */
  type?: ChatResponseType;
}

export const CONVERSATION_STORAGE_KEY = "mamabear-conversation-id";
