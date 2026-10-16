"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useApp, useCategoryLabel } from "@/components/app-context";
import { inputClass } from "@/components/ui/field";

export function ExpenseFilters() {
  const t = useTranslations("expenses");
  const { categories } = useApp();
  const label = useCategoryLabel();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [, startTransition] = useTransition();

  // Filters requested but possibly not in the URL yet: router.replace() is
  // async, so a debounced search fired right after a category change must
  // build on that change rather than on the stale URL (and vice versa).
  const pending = useRef<URLSearchParams | null>(null);
  useEffect(() => {
    pending.current = null; // the URL has caught up
  }, [params]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(pending.current ?? window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    pending.current = next;
    startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  };

  // Debounce the free-text search.
  useEffect(() => {
    if (q === (params.get("q") ?? "")) return;
    const id = setTimeout(() => update("q", q.trim()), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    // One row on phones too, so the list starts higher up the screen.
    <div className="flex gap-2">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{t("search")}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className={`${inputClass} pl-9`}
        />
      </label>
      <label className="w-[46%] shrink-0 sm:w-56">
        <span className="sr-only">{t("filterCategory")}</span>
        <select
          value={params.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
          className={`${inputClass} truncate pr-8`}
          aria-label={t("filterCategory")}
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {label(c)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
