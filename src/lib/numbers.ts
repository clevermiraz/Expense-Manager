const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Accepts "1,250.50" or Bangla digits "১২৫০" and returns a plain decimal string. */
export function normalizeAmount(raw: string): string {
  return raw
    .trim()
    .replace(/[০-৯]/g, (d) => String(BANGLA_DIGITS.indexOf(d)))
    .replace(/[,\s]/g, "");
}

/** "1250.5" → "১২৫০.৫" in Bangla; other locales keep ASCII digits. */
export function localizeDigits(value: string, locale: string): string {
  return locale === "bn" ? value.replace(/[0-9]/g, (d) => BANGLA_DIGITS[Number(d)]) : value;
}
