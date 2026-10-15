"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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

  const update = (key: string, value: string) => {
    // Read the live URL, not the render-time params, so a pending category
    // change isn't overwritten by a debounced search (and vice versa).
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
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
    <div className="flex flex-col gap-2 sm:flex-row">
      <label className="relative flex-1">
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
      <label className="sm:w-56">
        <span className="sr-only">{t("filterCategory")}</span>
        <select
          value={params.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
          className={inputClass}
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
