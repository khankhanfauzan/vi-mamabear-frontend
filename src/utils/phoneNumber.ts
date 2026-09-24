export function formatPhoneNumberInput(value: string): string {
  return value.replace(/\D/g, "").replace(/^[^8]*/, "");
}

export function isValidPhoneNumber(value: string): boolean {
  return /^8\d{8,}$/.test(value);
}
