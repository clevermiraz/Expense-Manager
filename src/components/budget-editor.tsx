"use client";

import { Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useErrorText } from "@/lib/use-error-text";
import { useState, useTransition } from "react";
import { setBudget } from "@/app/actions/budgets";
import { useApp, useCategoryLabel } from "@/components/app-context";
import { BudgetMeter, budgetState } from "@/components/charts/budget-meter";
import { CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { inputClass } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { normalizeAmount } from "@/lib/numbers";

export type BudgetRowData = {
  categoryId: string | null;
  budget: number | null;
  spent: number;
  average: number;
  suggestion: number;
};

export function BudgetEditor({
  rows,
  overall,
  trackedMonths,
  monthProgress,
}: {
  rows: BudgetRowData[];
  overall: BudgetRowData;
  trackedMonths: number;
  monthProgress: number;
}) {
  const t = useTranslations("budgets");
  const te = useErrorText();
  const locale = useLocale();
  const { currency } = useApp();
  const [applying, startApply] = useTransition();
  const pendingSuggestions = rows.filter((r) => r.budget === null && r.suggestion > 0);
  const categoryBudgetSum = rows.reduce((s, r) => s + (r.budget ?? 0), 0);

  function applyAll() {
    startApply(async () => {
      for (const r of pendingSuggestions) {
        const res = await setBudget(r.categoryId, r.suggestion);
        if (!res.ok) return toast(te(res.error), "error");
      }
      toast(t("appliedAll", { count: pendingSuggestions.length }));
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-col gap-2 text-sm text-ink-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span>
              {trackedMonths === 0
                ? t("noHistory")
                : t("suggestionInfo", { count: trackedMonths, n: formatNumber(trackedMonths, locale) })}
            </span>
          </p>
          {pendingSuggestions.length > 0 && (
            <Button variant="secondary" size="sm" onClick={applyAll} loading={applying} className="shrink-0">
              {t("applyAll", { count: pendingSuggestions.length })}
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title={t("overallTitle")} subtitle={t("overallHint")} />
        <BudgetRow key={`overall-${overall.budget}`} row={overall} monthProgress={monthProgress} />
        {categoryBudgetSum > 0 && (
          <p className="mt-3 text-xs text-ink-3">
            {t("categorySum", { amount: formatMoney(categoryBudgetSum, currency, locale) })}
          </p>
        )}
      </Card>

      <Card>
        <CardHeader title={t("categoryTitle")} subtitle={t("categoryHint")} />
        <ul className="flex flex-col divide-y divide-line">
          {rows.map((r) => (
            <li key={r.categoryId} className="py-4 first:pt-0 last:pb-0">
              <BudgetRow key={`${r.categoryId}-${r.budget}`} row={r} monthProgress={monthProgress} />
            </li>
          ))}
        </ul>
      </Card>
      <p className="px-1 text-xs text-ink-3">{t("percentHint", { pct: formatPercent(monthProgress, locale) })}</p>
    </div>
  );
}

function BudgetRow({ row, monthProgress }: { row: BudgetRowData; monthProgress: number }) {
  const t = useTranslations("budgets");
  const te = useErrorText();
  const locale = useLocale();
  const { currency, categoryById } = useApp();
  const label = useCategoryLabel();
  const [value, setValue] = useState(row.budget === null ? "" : String(row.budget));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const money = (v: number) => formatMoney(v, currency, locale);
  const cat = row.categoryId ? categoryById.get(row.categoryId) : undefined;
  const name = row.categoryId ? label(cat) : t("overall");
  const inputId = `budget-${row.categoryId ?? "overall"}`;

  function save(next: string) {
    const normalized = normalizeAmount(next);
    if (normalized === (row.budget === null ? "" : String(row.budget))) return;
    setError(null);
    startTransition(async () => {
      const res = await setBudget(row.categoryId, normalized === "" ? null : normalized);
      if (!res.ok) {
        setError(te(res.fields?.amount ?? res.error));
        return;
      }
      toast(normalized === "" ? t("removed", { name }) : t("saved", { name }));
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center" data-testid="budget-row">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {cat && <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />}
          <label htmlFor={inputId} className="font-medium text-ink">
            {name}
          </label>
        </div>
        <p className="mt-1 text-xs text-ink-3">
          {t("spentSoFar", { amount: money(row.spent) })}
          {row.average > 0 && (
            <> · {t("avgLabel", { amount: formatMoney(row.average, currency, locale, { whole: true }) })}</>
          )}
        </p>
        {row.budget !== null && (
          <div className="mt-2 max-w-md">
            <BudgetMeter
              spent={row.spent}
              limit={row.budget}
              marker={monthProgress}
              statusLabel={t(`status.${budgetState(row.spent, row.budget)}`, {
                pct: formatPercent(row.spent / row.budget, locale),
                left: money(Math.max(0, row.budget - row.spent)),
                over: money(Math.max(0, row.spent - row.budget)),
              })}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 sm:items-end">
        <div className="flex items-center gap-2">
          {row.suggestion > 0 && row.budget !== row.suggestion && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setValue(String(row.suggestion));
                save(String(row.suggestion));
              }}
              disabled={pending}
              title={t("useSuggestion")}
            >
              {t("suggest", { amount: money(row.suggestion) })}
            </Button>
          )}
          <input
            id={inputId}
            inputMode="decimal"
            placeholder={t("noLimit")}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => save(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            aria-invalid={!!error}
            disabled={pending}
            className={`${inputClass} w-32 text-right tabular`}
          />
        </div>
        {error && (
          <p className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
