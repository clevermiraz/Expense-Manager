export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bn";
export const LOCALE_COOKIE = "NEXT_LOCALE";
/** Set by the proxy on pages whose URL fixes the language (the blog). */
export const LOCALE_HEADER = "x-hisab-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** BCP 47 tag used for Intl formatting (bn-BD renders Bangla digits). */
export const intlLocale: Record<Locale, string> = { en: "en-US", bn: "bn-BD" };
