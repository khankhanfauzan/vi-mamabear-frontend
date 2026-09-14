export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt?: string;
};

export type ConversationHistory = {
  conversationId: string;
  messages: ChatMessage[];
};

export const CONVERSATION_STORAGE_KEY = "mamabear-conversation-id";
