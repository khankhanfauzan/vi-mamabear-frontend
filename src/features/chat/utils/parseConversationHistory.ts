import type {
  ChatMessage,
  ChatProduct,
  ChatRole,
  ConversationHistory,
} from "../types/chat.types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function normalizeRole(role: unknown): ChatRole {
  const value = String(role ?? "").toLowerCase();
  if (value === "user" || value === "human" || value === "customer") {
    return "user";
  }
  return "assistant";
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

export function normalizeChatProduct(raw: unknown, index: number): ChatProduct | null {
  const item = asRecord(raw);
  if (!item) return null;

  const name = String(item.name ?? item.title ?? "").trim();
  const slug = String(item.slug ?? "").trim();
  const id = item.id ?? slug ?? `product-${index}`;

  if (!name && !slug) return null;

  return {
    id: typeof id === "number" ? id : String(id),
    name: name || slug || "Produk MamaBear",
    slug,
    category: item.category ? String(item.category) : undefined,
    imageUrl: item.imageUrl
      ? String(item.imageUrl)
      : item.image
        ? String(item.image)
        : undefined,
    price: asNumber(item.price),
    formattedPrice: item.formattedPrice
      ? String(item.formattedPrice)
      : undefined,
    rating: asNumber(item.rating),
    reviewCount: asNumber(item.reviewCount),
    totalSold: asNumber(item.totalSold),
    shortDescription: item.shortDescription
      ? String(item.shortDescription)
      : undefined,
  };
}

export function normalizeChatProducts(raw: unknown): ChatProduct[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const products = raw
    .map(normalizeChatProduct)
    .filter((product): product is ChatProduct => Boolean(product));
  return products.length > 0 ? products : undefined;
}

export function normalizeChatMessage(raw: unknown, index: number): ChatMessage {
  const item = asRecord(raw) ?? {};
  const content = item.content ?? item.message ?? item.text ?? item.reply ?? "";

  return {
    id: String(item.id ?? item._id ?? `msg-${index}`),
    role: normalizeRole(item.role ?? item.sender ?? item.from),
    content: String(content),
    createdAt: item.createdAt
      ? String(item.createdAt)
      : item.timestamp
        ? String(item.timestamp)
        : undefined,
    products: normalizeChatProducts(item.products),
  };
}

export function parseConversationHistory(
  payload: unknown,
  fallbackConversationId: string,
): ConversationHistory {
  const root = asRecord(payload);
  const data = (root?.data ?? payload) as unknown;
  const dataRecord = asRecord(data);

  const rawMessages = Array.isArray(data)
    ? data
    : Array.isArray(dataRecord?.messages)
      ? dataRecord.messages
      : Array.isArray(dataRecord?.history)
        ? dataRecord.history
        : Array.isArray(dataRecord?.items)
          ? dataRecord.items
          : [];

  const conversationId = String(
    dataRecord?.conversationId ??
      dataRecord?.id ??
      root?.conversationId ??
      fallbackConversationId,
  );

  return {
    conversationId,
    messages: rawMessages.map(normalizeChatMessage),
  };
}
