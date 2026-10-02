import type { ChatResponseType } from "../types/chat.types";

type TypedResponse = { type?: ChatResponseType } | null | undefined;

/**
 * Coerce nilai `type` dari API menjadi union yang aman.
 * Nilai yang tidak dikenal (undefined, null, string lain) menjadi undefined
 * supaya response lama tetap kompatibel dan dianggap sebagai "answer".
 */
export function normalizeChatResponseType(
  value: unknown,
): ChatResponseType | undefined {
  const type = String(value ?? "")
    .trim()
    .toLowerCase();

  if (type === "clarification") return "clarification";
  if (type === "answer") return "answer";

  return undefined;
}

export function isClarificationResponse(response: TypedResponse): boolean {
  return response?.type === "clarification";
}

/**
 * `undefined` (response lama) dianggap "answer".
 * Defined sebagai negasi dari clarification agar tidak pernah divergen
 * dari aturan backward compatibility di atas.
 */
export function isAnswerResponse(response: TypedResponse): boolean {
  return !isClarificationResponse(response);
}