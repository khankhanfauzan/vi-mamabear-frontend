const WA_CORE = "(?:\\+?62|0)8[1-9][0-9]{6,10}";

function waRegex() {
  return new RegExp(WA_CORE, "g");
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
    .replace(new RegExp(`\\s*\\([*_\\s]*${WA_CORE}[*_\\s]*\\)`, "g"), "")
    .replace(new RegExp(`\\s*\\[[*_\\s]*${WA_CORE}[*_\\s]*\\]`, "g"), "")
    .replace(new RegExp(`[*_]{1,2}${WA_CORE}[*_]{1,2}`, "g"), "")
    .replace(new RegExp(WA_CORE, "g"), "")
    .replace(/\s*\(\s*\)/g, "")
    .replace(/\s*\[\s*\]/g, "")
    .replace(/\*{2,4}/g, "")
    .replace(/[ \t]+([.,!?:;])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
