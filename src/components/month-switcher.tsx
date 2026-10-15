"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { addMonths } from "@/lib/dates";
import { formatMonth } from "@/lib/format";

export function MonthSwitcher({ month, maxMonth }: { month: string; maxMonth: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useSearchParams();

  const href = (m: string) => {
    const next = new URLSearchParams(params);
    next.set("month", m);
    return `${pathname}?${next.toString()}`;
  };
  const prev = addMonths(month, -1);
  const nextMonth = addMonths(month, 1);
  const canNext = nextMonth <= maxMonth;
  const btn =
    "inline-flex size-9 items-center justify-center rounded-xl text-ink-2 hover:bg-muted hover:text-ink aria-disabled:pointer-events-none aria-disabled:opacity-30";

  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-line bg-surface p-0.5">
      <Link href={href(prev)} className={btn} aria-label={t("previousMonth")} scroll={false}>
        <ChevronLeft className="size-4" aria-hidden />
      </Link>
      <span className="min-w-32 text-center text-sm font-semibold text-ink" aria-live="polite" data-testid="current-month">
        {formatMonth(month, locale)}
      </span>
      <Link
        href={canNext ? href(nextMonth) : "#"}
        aria-disabled={!canNext}
        tabIndex={canNext ? undefined : -1}
        className={btn}
        aria-label={t("nextMonth")}
        scroll={false}
      >
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
