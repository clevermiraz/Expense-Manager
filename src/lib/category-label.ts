import type { Category } from "@/lib/data";

/** Server-side counterpart of useCategoryLabel(). */
export function categoryLabel(c: Pick<Category, "key" | "name"> | undefined, t: (key: string) => string) {
  if (!c) return "";
  return c.key ? t(c.key) : (c.name ?? "");
}
