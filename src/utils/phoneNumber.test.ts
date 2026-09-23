import { formatPhoneNumberInput, isValidPhoneNumber } from "./phoneNumber";

describe("formatPhoneNumberInput", () => {
  it.each([
    ["081234567890", "81234567890"],
    ["+62 812-3456-7890", "81234567890"],
    ["381234567890", "81234567890"],
    ["3", ""],
    ["81234567890", "81234567890"],
  ])("formats %s as %s", (input, expected) => {
    expect(formatPhoneNumberInput(input)).toBe(expected);
  });
});

describe("isValidPhoneNumber", () => {
  it.each(["812345678", "81234567890"])("accepts %s", (value) => {
    expect(isValidPhoneNumber(value)).toBe(true);
  });

  it.each(["", "3", "31234567890", "81234567"])("rejects %s", (value) => {
    expect(isValidPhoneNumber(value)).toBe(false);
  });
});
