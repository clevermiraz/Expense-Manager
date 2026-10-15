const BANGLA_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Accepts "1,250.50" or Bangla digits "১২৫০" and returns a plain decimal string. */
export function normalizeAmount(raw: string): string {
  return raw
    .trim()
    .replace(/[০-৯]/g, (d) => String(BANGLA_DIGITS.indexOf(d)))
    .replace(/[,\s]/g, "");
}
