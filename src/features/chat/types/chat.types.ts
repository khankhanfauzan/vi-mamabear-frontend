export type ChatRole = "user" | "assistant";

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
};

export type ConversationHistory = {
  conversationId: string;
  messages: ChatMessage[];
};

export interface SendChatMessageResponse {
  conversationId: string;
  reply: string;
  products?: ChatProduct[];
}

export const CONVERSATION_STORAGE_KEY = "mamabear-conversation-id";
