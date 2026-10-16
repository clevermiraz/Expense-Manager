"use client";

import { Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useApp, useCategoryLabel } from "@/components/app-context";
import { CategoryIcon } from "@/components/category-icon";
import type { ExpenseRow } from "@/lib/data";
import { formatDay, formatMoney } from "@/lib/format";

export function ExpenseList({ expenses, grouped = true }: { expenses: ExpenseRow[]; grouped?: boolean }) {
  const t = useTranslations("expenses");
  const locale = useLocale();
  const { currency, today } = useApp();

  if (expenses.length === 0) {
    return <p className="py-6 text-center text-sm text-ink-3">{t("none")}</p>;
  }

  if (!grouped) {
    return (
      <ul className="-mx-2 flex flex-col">
        {expenses.map((e) => (
          <ExpenseItem key={e.id} expense={e} showDate />
        ))}
      </ul>
    );
  }

  const groups: { day: string; total: number; items: ExpenseRow[] }[] = [];
  for (const e of expenses) {
    const last = groups[groups.length - 1];
    if (last && last.day === e.spentOn) {
      last.items.push(e);
      last.total += e.amount;
    } else {
      groups.push({ day: e.spentOn, total: e.amount, items: [e] });
    }
  }

  const yesterday = (() => {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  })();

  return (
    <div className="flex flex-col gap-5">
      {groups.map((g) => (
        <section key={g.day} aria-label={formatDay(g.day, locale, { dateStyle: "full" })} data-testid="day-group">
          <div className="mb-1 flex items-baseline justify-between border-b border-line pb-2 text-sm">
            <h3 className="font-semibold text-ink">
              {g.day === today
                ? t("today")
                : g.day === yesterday
                  ? t("yesterday")
                  : formatDay(g.day, locale, { weekday: "long", day: "numeric", month: "long" })}
            </h3>
            <span className="font-medium text-ink-2 tabular" data-testid="day-total">
              {formatMoney(g.total, currency, locale)}
            </span>
          </div>
          <ul className="-mx-2 flex flex-col">
            {g.items.map((e) => (
              <ExpenseItem key={e.id} expense={e} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ExpenseItem({ expense, showDate = false }: { expense: ExpenseRow; showDate?: boolean }) {
  const t = useTranslations("expenses");
  const tp = useTranslations("paymentMethods");
  const locale = useLocale();
  const { currency, categoryById, openExpense } = useApp();
  const label = useCategoryLabel();
  const cat = categoryById.get(expense.categoryId);
  const meta = [showDate ? formatDay(expense.spentOn, locale) : null, tp(expense.paymentMethod)]
    .filter(Boolean)
    .join(" · ");

  return (
    <li data-testid="expense-row">
      <button
        type="button"
        onClick={() => openExpense(expense)}
        aria-label={t("editItem", { category: label(cat), amount: formatMoney(expense.amount, currency, locale) })}
        className="group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-muted cursor-pointer"
      >
        {cat && <CategoryIcon icon={cat.icon} color={cat.color} />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{expense.note || label(cat)}</p>
          <p className="truncate text-xs text-ink-3">
            {expense.note ? `${label(cat)} · ` : ""}
            {meta}
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-ink tabular" data-testid="expense-amount">
          {formatMoney(expense.amount, currency, locale)}
        </span>
        <Pencil className="hidden size-3.5 shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100 sm:block" aria-hidden />
      </button>
    </li>
  );
}
