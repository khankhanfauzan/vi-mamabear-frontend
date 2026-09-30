const WA_PATTERN = /(\+?62|0)8[1-9][0-9]{6,10}/g;

function waRegex() {
  return new RegExp(WA_PATTERN.source, WA_PATTERN.flags);
}

export function normalizeToWaLink(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  const withCountryCode = digitsOnly.startsWith("0")
    ? `62${digitsOnly.slice(1)}`
    : digitsOnly.startsWith("62")
      ? digitsOnly
      : `62${digitsOnly}`;

  return `https://wa.me/${withCountryCode}`;
}

export function extractWhatsAppNumbers(text: string): string[] {
  return Array.from(new Set(text.match(waRegex()) ?? []));
}

export function stripWhatsAppNumbers(text: string): string {
  return text
    .replace(waRegex(), "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
