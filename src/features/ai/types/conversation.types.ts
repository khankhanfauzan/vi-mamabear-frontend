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
