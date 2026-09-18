export interface AiConversation {
  id: string;
  title?: string | null;
  preview?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AiConversationHistoryResult {
  conversations: AiConversation[];
  isMock: boolean;
}

export type AiChatMessageRole = "user" | "assistant";

export interface AiChatMessage {
  id: string;
  role: AiChatMessageRole;
  content: string;
}

export interface AiChatRequest {
  message: string;
  conversationId?: string;
}

export interface AiChatResponse {
  conversationId: string;
  reply: string;
}
