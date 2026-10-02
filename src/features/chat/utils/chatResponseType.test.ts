import {
  isAnswerResponse,
  isClarificationResponse,
  normalizeChatResponseType,
} from "./chatResponseType";

describe("normalizeChatResponseType", () => {
  it.each([
    ["clarification", "clarification"],
    ["answer", "answer"],
    ["CLARIFICATION", "clarification"],
    ["  Answer  ", "answer"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizeChatResponseType(input)).toBe(expected);
  });

  it.each([[undefined], [null], [""], ["unknown"], [42], [{}]])(
    "returns undefined for %s so legacy responses stay backward compatible",
    (input) => {
      expect(normalizeChatResponseType(input)).toBeUndefined();
    },
  );
});

describe("isClarificationResponse / isAnswerResponse", () => {
  it("detects a clarification response", () => {
    expect(isClarificationResponse({ type: "clarification" })).toBe(true);
    expect(isAnswerResponse({ type: "clarification" })).toBe(false);
  });

  it("treats an explicit answer as answer", () => {
    expect(isClarificationResponse({ type: "answer" })).toBe(false);
    expect(isAnswerResponse({ type: "answer" })).toBe(true);
  });

  it.each([[undefined], [{}], [null]])(
    "treats a legacy response without type (%s) as answer",
    (response) => {
      expect(isClarificationResponse(response)).toBe(false);
      expect(isAnswerResponse(response)).toBe(true);
    },
  );
});