import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BudgetEditor, type BudgetRowData } from "@/components/budget-editor";
import { PageHeader } from "@/components/page-header";
import { getBudgets, getCategories, getCategoryMonthMatrix, getFirstExpenseMonth, getMonthSummary } from "@/lib/data";
import { addMonths, daysInMonth, monthOf, monthsEndingAt } from "@/lib/dates";
import { niceCeil } from "@/lib/format";
import { requireUser, userToday } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("budgets") };
}

const LOOKBACK = 3;

export default async function BudgetsPage() {
  const user = await requireUser();
  const today = userToday(user);
  const currentMonth = monthOf(today);
  const lastComplete = addMonths(currentMonth, -1);

  const [categories, budgets, summary, history, firstMonth, t] = await Promise.all([
    getCategories(user.id),
    getBudgets(user.id),
    getMonthSummary(user.id, currentMonth),
    getCategoryMonthMatrix(user.id, lastComplete, LOOKBACK),
    getFirstExpenseMonth(user.id),
    getTranslations("budgets"),
  ]);

  // Only average over months you were actually tracking.
  const trackedMonths = firstMonth
    ? monthsEndingAt(lastComplete, LOOKBACK).filter((m) => m >= firstMonth).length
    : 0;
  const sums = new Map<string, number>();
  for (const r of history) sums.set(r.categoryId, (sums.get(r.categoryId) ?? 0) + r.total);
  const avg = (categoryId: string) => (trackedMonths > 0 ? (sums.get(categoryId) ?? 0) / trackedMonths : 0);
  const spentBy = new Map(summary.byCategory.map((c) => [c.categoryId, c.total]));

  const rows: BudgetRowData[] = categories
    .map((c) => ({
      categoryId: c.id,
      budget: budgets.byCategory.get(c.id) ?? null,
      spent: spentBy.get(c.id) ?? 0,
      average: avg(c.id),
      suggestion: niceCeil(avg(c.id)),
    }))
    .sort((a, b) => b.average - a.average || b.spent - a.spent);

  const overallAvg = [...sums.values()].reduce((s, v) => s + v, 0) / Math.max(1, trackedMonths);

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <BudgetEditor
        rows={rows}
        overall={{
          categoryId: null,
          budget: budgets.overall,
          spent: summary.total,
          average: trackedMonths > 0 ? overallAvg : 0,
          suggestion: trackedMonths > 0 ? niceCeil(overallAvg) : 0,
        }}
        trackedMonths={trackedMonths}
        monthProgress={Number(today.slice(8, 10)) / daysInMonth(currentMonth)}
      />
    </>
  );
}
