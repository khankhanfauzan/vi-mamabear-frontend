import { AiConversation } from "@/features/ai/types/conversation.types";

// Temporary mock data until GET /ai/conversations is available.
export const mockAiConversations: AiConversation[] = [
  {
    id: "mock-conversation-1",
    title: "Rekomendasi produk untuk ibu menyusui",
    preview: "Produk apa yang cocok untuk bantu menjaga kualitas ASI?",
    updatedAt: "2026-09-11T08:30:00.000Z",
  },
  {
    id: "mock-conversation-2",
    title: "Cara konsumsi cookies MamaBear",
    preview: "Berapa kali sehari sebaiknya konsumsi cookies ini?",
    updatedAt: "2026-09-09T13:15:00.000Z",
  },
];
