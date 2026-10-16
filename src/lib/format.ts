import { intlLocale, type Locale } from "@/i18n/config";
import { dayToDate, monthToDate } from "@/lib/dates";

const tag = (locale: string) => intlLocale[locale as Locale] ?? "en-US";

/** `whole` for derived figures such as averages and projections, where paisa/cents are just noise. */
export function formatMoney(value: number, currency: string, locale: string, opts: { whole?: boolean } = {}): string {
  return new Intl.NumberFormat(tag(locale), {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: opts.whole ? 0 : 2,
  }).format(value);
}

/**
 * Short amounts for chart axes and dense tables: "35K" / "৩৫ হাজার".
 * No currency sign (the context says it's money), and Bangla spells out
 * হাজার/লাখ because the short "হা"/"লা" followed by ৳ reads as other words.
 */
export function formatCompact(value: number, locale: string): string {
  return new Intl.NumberFormat(tag(locale), {
    notation: "compact",
    compactDisplay: locale === "bn" ? "long" : "short",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number, locale: string, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(tag(locale), { maximumFractionDigits }).format(value);
}

export function formatPercent(ratio: number, locale: string, signed = false): string {
  return new Intl.NumberFormat(tag(locale), {
    style: "percent",
    maximumFractionDigits: 0,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(ratio);
}

export function formatDay(day: string, locale: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) {
  return new Intl.DateTimeFormat(tag(locale), { ...opts, timeZone: "UTC" }).format(dayToDate(day));
}

export function formatMonth(month: string, locale: string, style: "long" | "short" = "long") {
  return new Intl.DateTimeFormat(tag(locale), { month: style, year: "numeric", timeZone: "UTC" }).format(
    monthToDate(month),
  );
}

export function formatMonthName(month: string, locale: string) {
  return new Intl.DateTimeFormat(tag(locale), { month: "short", timeZone: "UTC" }).format(monthToDate(month));
}

export function formatWeekday(dow: number, locale: string, style: "long" | "short" = "short") {
  // 2023-01-01 was a Sunday (dow 0).
  return new Intl.DateTimeFormat(tag(locale), { weekday: style, timeZone: "UTC" }).format(
    new Date(Date.UTC(2023, 0, 1 + dow, 12)),
  );
}

/** Round a suggested budget up to a friendly number. */
export function niceCeil(value: number): number {
  if (value <= 0) return 0;
  const step = value >= 10000 ? 500 : value >= 1000 ? 100 : value >= 100 ? 10 : 1;
  return Math.ceil(value / step) * step;
}
