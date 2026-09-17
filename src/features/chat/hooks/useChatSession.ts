import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useConversationHistory } from "./useConversationHistory";
import {
  CONVERSATION_STORAGE_KEY,
  type ChatMessage,
  type ChatProduct,
} from "../types/chat.types";

export const MAX_MESSAGE_LENGTH = 1000;

const OPENING_MESSAGE: ChatMessage = {
  id: "opening",
  role: "assistant",
  content: "Hai Mama! Ada yang bisa MamaBear bantu hari ini?",
};

const SAMPLE_PRODUCTS: ChatProduct[] = [
  {
    id: 1,
    name: "Kukis Almond Oat Mama Bear",
    slug: "kukis-almond-oat-mama-bear",
    category: "SUPERFOOD CAMILAN",
    imageUrl: "/images/layout/logo.png",
    price: 35000,
    formattedPrice: "Rp 35.000",
    rating: 4.9,
    reviewCount: 14200,
    totalSold: 500000,
    shortDescription:
      "Kaya serat & almond superfood untuk melancarkan ASI",
  },
];

const MOCK_REPLIES: Array<{ content: string; products?: ChatProduct[] }> = [
  {
    content:
      "Pilihan tepat sekali, Ma! Untuk camilan lezat bernutrisi tinggi, Mama Bear punya rekomendasi favorit para busui:",
    products: SAMPLE_PRODUCTS,
  },
  {
    content:
      "Terima kasih sudah menghubungi MamaBear. Tim kami akan bantu secepatnya.",
  },
  {
    content: "Baik, Mama. Ada lagi yang ingin ditanyakan?",
  },
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChatSession(options: { historyEnabled?: boolean } = {}) {
  const historyEnabled = options.historyEnabled ?? true;
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([
    OPENING_MESSAGE,
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const replyIndex = useRef(0);

  const history = useConversationHistory(conversationId, {
    enabled: historyEnabled,
  });
  const usingHistory = Boolean(conversationId);
  const messages = usingHistory ? history.messages : localMessages;
  const setMessages = usingHistory ? history.setMessages : setLocalMessages;
  const remainingChars = MAX_MESSAGE_LENGTH - input.length;
  const canSend =
    input.trim().length > 0 &&
    input.length <= MAX_MESSAGE_LENGTH &&
    !isSending &&
    !(usingHistory && history.isLoading);

  useEffect(() => {
    const storedId = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (storedId) setConversationId(storedId);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || text.length > MAX_MESSAGE_LENGTH || isSending) return;

    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "user", content: text },
    ]);
    setInput("");
    setIsSending(true);

    const reply = MOCK_REPLIES[replyIndex.current % MOCK_REPLIES.length];
    replyIndex.current += 1;

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: reply.content,
          products: reply.products,
        },
      ]);
      setIsSending(false);
    }, 600);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    sendMessage();
  };

  return {
    input,
    setInput,
    isSending,
    conversationId,
    usingHistory,
    messages,
    listRef,
    remainingChars,
    canSend,
    history,
    sendMessage,
    handleInputKeyDown,
  };
}
