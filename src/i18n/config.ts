export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** BCP 47 tag used for Intl formatting (bn-BD renders Bangla digits). */
export const intlLocale: Record<Locale, string> = { en: "en-US", bn: "bn-BD" };
