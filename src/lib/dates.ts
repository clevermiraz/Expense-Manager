// Calendar helpers working on plain "YYYY-MM" / "YYYY-MM-DD" strings so that
// there is never any timezone drift between server, client and database.

const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;
const DAY_RE = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export function isValidTimeZone(tz: string): boolean {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function todayInTimeZone(tz: string, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: isValidTimeZone(tz) ? tz : "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Hour of the day (0-23) right now in a timezone. */
export function hourInTimeZone(tz: string, now: Date = new Date()): number {
  const h = new Intl.DateTimeFormat("en-US", {
    timeZone: isValidTimeZone(tz) ? tz : "UTC",
    hour: "numeric",
    hourCycle: "h23",
  }).format(now);
  return Number(h);
}

/** "2026-10-16" + -1 → "2026-10-15". */
export function addDays(day: string, delta: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10);
}

export function isValidMonth(value: string | null | undefined): value is string {
  return !!value && MONTH_RE.test(value);
}

export function isValidDay(value: string | null | undefined): value is string {
  if (!value || !DAY_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  return d <= daysInMonth(`${y}-${String(m).padStart(2, "0")}`);
}

export function monthOf(day: string): string {
  return day.slice(0, 7);
}

export function addMonths(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const total = y * 12 + (m - 1) + delta;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

export function daysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Inclusive start, exclusive end, both as YYYY-MM-DD. */
export function monthRange(month: string): { start: string; end: string } {
  return { start: `${month}-01`, end: `${addMonths(month, 1)}-01` };
}

/** `count` months ending at (and including) `endMonth`, oldest first. */
export function monthsEndingAt(endMonth: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addMonths(endMonth, i - count + 1));
}

/** Date object at UTC noon for formatting a calendar day without TZ shifts. */
export function dayToDate(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function monthToDate(month: string): Date {
  return dayToDate(`${month}-01`);
}

/** A valid ?month= value no later than `maxMonth`, otherwise `fallback`. */
export function resolveMonth(value: unknown, maxMonth: string, fallback = maxMonth): string {
  return typeof value === "string" && isValidMonth(value) && value <= maxMonth && value >= "2000-01" ? value : fallback;
}

/** Months from `from` to `to` inclusive (0 if from > to). */
export function monthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  return Math.max(0, (ty - fy) * 12 + (tm - fm) + 1);
}
