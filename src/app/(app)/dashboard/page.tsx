import { ArrowDownRight, ArrowUpRight, Lightbulb, Receipt } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { AddExpenseButton } from "@/components/add-expense-button";
import { BudgetMeter, budgetState } from "@/components/charts/budget-meter";
import { SpendBarChart } from "@/components/charts/bar-chart";
import { RankedBars } from "@/components/charts/ranked-bars";
import { CategoryIcon } from "@/components/category-icon";
import { ExpenseList } from "@/components/expense-list";
import { MonthSwitcher } from "@/components/month-switcher";
import { PageHeader } from "@/components/page-header";
import { StatTile } from "@/components/stat-tile";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { categoryLabel } from "@/lib/category-label";
import { getBudgets, getCategories, getCategoryMonthMatrix, getExpenses, getMonthSummary } from "@/lib/data";
import { addMonths, daysInMonth, monthOf, resolveMonth } from "@/lib/dates";
import { formatDay, formatMoney, formatMonth, formatNumber, formatPercent } from "@/lib/format";
import { requireUser, userToday } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("dashboard") };
}

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const user = await requireUser();
  const sp = await searchParams;
  const today = userToday(user);
  const currentMonth = monthOf(today);
  const month = resolveMonth(sp.month, currentMonth);
  const prevMonth = addMonths(month, -1);

  const [summary, prev, budgets, categories, expenses, history, t, tc, locale] = await Promise.all([
    getMonthSummary(user.id, month),
    getMonthSummary(user.id, prevMonth),
    getBudgets(user.id),
    getCategories(user.id),
    getExpenses(user.id, { month }),
    // the 3 months before the selected one, for "unusual spending" hints
    getCategoryMonthMatrix(user.id, prevMonth, 3),
    getTranslations("dashboard"),
    getTranslations("categories"),
    getLocale(),
  ]);

  const money = (v: number) => formatMoney(v, user.currency, locale);
  const wholeMoney = (v: number) => formatMoney(v, user.currency, locale, { whole: true });
  const catById = new Map(categories.map((c) => [c.id, c]));
  const isCurrent = month === currentMonth;
  const totalDays = daysInMonth(month);
  const elapsedDays = isCurrent ? Number(today.slice(8, 10)) : totalDays;
  const dailyAvg = summary.total / Math.max(1, elapsedDays);
  const projected = isCurrent ? dailyAvg * totalDays : summary.total;
  const delta = prev.total > 0 ? (summary.total - prev.total) / prev.total : null;

  const categoryBudgetTotal = [...budgets.byCategory.values()].reduce((s, v) => s + v, 0);
  const budgetLimit = budgets.overall ?? (categoryBudgetTotal > 0 ? categoryBudgetTotal : null);
  const overBudget = budgetLimit !== null && summary.total > budgetLimit;

  // Daily chart: every day of the month, zero-filled.
  const byDay = new Map(summary.byDay.map((d) => [d.day, d.total]));
  const daily = Array.from({ length: totalDays }, (_, i) => {
    const day = `${month}-${String(i + 1).padStart(2, "0")}`;
    return {
      key: day,
      tick: formatNumber(i + 1, locale),
      label: formatDay(day, locale, { weekday: "short", day: "numeric", month: "short" }),
      value: byDay.get(day) ?? 0,
    };
  });
  const biggestDay = summary.byDay.reduce<{ day: string; total: number } | null>(
    (best, d) => (!best || d.total > best.total ? d : best),
    null,
  );

  // Unusual spending: categories already clearly above their usual monthly
  // total. Deliberately not projected forward: once-a-month bills (rent,
  // utilities) would look huge early in the month.
  const histAvg = new Map<string, number>();
  for (const r of history) histAvg.set(r.categoryId, (histAvg.get(r.categoryId) ?? 0) + r.total / 3);
  const unusual = summary.byCategory
    .map((c) => ({ ...c, avg: histAvg.get(c.categoryId) ?? 0 }))
    .filter((c) => c.avg > 0 && c.total > c.avg * (isCurrent ? 1.15 : 1.3))
    .sort((a, b) => b.total / b.avg - a.total / a.avg)
    .slice(0, 2);

  const budgetRows = categories
    .filter((c) => budgets.byCategory.has(c.id))
    .map((c) => {
      const limit = budgets.byCategory.get(c.id)!;
      const spent = summary.byCategory.find((x) => x.categoryId === c.id)?.total ?? 0;
      return { c, limit, spent };
    })
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit);

  const hasAnyData = summary.count > 0;

  return (
    <>
      <PageHeader
        title={t("title")}
        subtitle={t("greeting", { name: user.name.split(" ")[0] })}
        actions={<MonthSwitcher month={month} maxMonth={currentMonth} />}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          testId="stat-total"
          tone="hero"
          className="col-span-2 lg:col-span-1"
          label={isCurrent ? t("spentThisMonth") : t("spentIn", { month: formatMonth(month, locale) })}
          value={money(summary.total)}
          footer={
            delta === null ? (
              t("noPrevious")
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 font-medium text-white">
                {delta > 0 ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
                {t("vsLastMonth", { pct: formatPercent(delta, locale, true) })}
              </span>
            )
          }
        />
        <StatTile
          testId="stat-daily"
          label={t("dailyAverage")}
          value={wholeMoney(dailyAvg)}
          footer={t("overDays", { count: elapsedDays, days: formatNumber(elapsedDays, locale) })}
        />
        <StatTile
          testId="stat-projected"
          label={isCurrent ? t("projected") : t("transactions")}
          value={isCurrent ? wholeMoney(projected) : formatNumber(summary.count, locale)}
          footer={isCurrent ? t("projectedHint") : t("entriesHint")}
        />
        <StatTile
          testId="stat-budget"
          className="col-span-2 lg:col-span-1"
          // Over budget reads as "Over budget by ৳X" in red, never a negative "left".
          label={overBudget ? t("overBudgetBy") : t("budgetLeft")}
          value={
            budgetLimit === null ? (
              "—"
            ) : overBudget ? (
              <span className="text-danger">{money(summary.total - budgetLimit)}</span>
            ) : (
              money(budgetLimit - summary.total)
            )
          }
          footer={
            budgetLimit === null ? (
              <Link href="/budgets" className="-m-2 inline-block p-2 font-medium text-primary hover:underline">
                {t("setBudget")}
              </Link>
            ) : (
              <BudgetMeter
                spent={summary.total}
                limit={budgetLimit}
                marker={isCurrent ? elapsedDays / totalDays : undefined}
                statusLabel={t(`budgetStatus.${budgetState(summary.total, budgetLimit)}`, {
                  pct: formatPercent(summary.total / budgetLimit, locale),
                })}
              />
            )
          }
        />
      </div>

      {!hasAnyData ? (
        <Card className="mt-4">
          <EmptyState
            icon={<Receipt className="size-10" />}
            title={t("emptyTitle")}
            body={t("emptyBody")}
            action={<AddExpenseButton label={t("addFirst")} />}
          />
        </Card>
      ) : (
        <>
          {unusual.length > 0 && (
            <div className="mt-4 flex flex-col gap-2" data-testid="unusual">
              {unusual.map((u) => (
                <div
                  key={u.categoryId}
                  className="flex items-start gap-3 rounded-2xl border border-warn/25 bg-warn/8 px-4 py-3 text-sm text-ink-2"
                >
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
                  <span>
                    {isCurrent
                      ? t("unusualCurrent", {
                          category: categoryLabel(catById.get(u.categoryId), tc),
                          spent: wholeMoney(u.total),
                          avg: wholeMoney(u.avg),
                        })
                      : t("unusualPast", {
                          category: categoryLabel(catById.get(u.categoryId), tc),
                          spent: wholeMoney(u.total),
                          avg: wholeMoney(u.avg),
                        })}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader
                title={t("dailySpending")}
                subtitle={
                  biggestDay
                    ? t("biggestDay", {
                        day: formatDay(biggestDay.day, locale, { day: "numeric", month: "long" }),
                        amount: money(biggestDay.total),
                      })
                    : undefined
                }
              />
              <SpendBarChart data={daily} currency={user.currency} ariaLabel={t("dailySpending")} />
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader
                title={t("byCategory")}
                action={
                  <Link href={`/insights`} className="-m-2 p-2 text-sm font-medium text-primary hover:underline">
                    {t("seeTrends")}
                  </Link>
                }
              />
              <RankedBars
                rows={summary.byCategory.slice(0, 7).map((c) => {
                  const cat = catById.get(c.categoryId);
                  return {
                    id: c.categoryId,
                    label: categoryLabel(cat, tc),
                    leading: cat ? <CategoryIcon icon={cat.icon} color={cat.color} size="sm" /> : null,
                    value: c.total,
                    valueLabel: money(c.total),
                    detail: formatPercent(c.total / summary.total, locale),
                  };
                })}
              />
              {summary.byCategory.length > 7 && (
                <p className="mt-3 text-xs text-ink-3">
                  {t("moreCategories", { count: summary.byCategory.length - 7 })}
                </p>
              )}
            </Card>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader
                title={t("recent")}
                action={
                  <Link href={`/expenses?month=${month}`} className="-m-2 p-2 text-sm font-medium text-primary hover:underline">
                    {t("viewAll")}
                  </Link>
                }
              />
              <ExpenseList expenses={expenses.slice(0, 8)} grouped={false} />
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader
                title={t("budgets")}
                action={
                  <Link href="/budgets" className="-m-2 p-2 text-sm font-medium text-primary hover:underline">
                    {t("manage")}
                  </Link>
                }
              />
              {budgetRows.length === 0 ? (
                <p className="text-sm text-ink-3">{t("noBudgets")}</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {budgetRows.slice(0, 5).map(({ c, limit, spent }) => (
                    <li key={c.id}>
                      <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                        <span className="flex items-center gap-2 font-medium text-ink">
                          <CategoryIcon icon={c.icon} color={c.color} size="sm" />
                          {categoryLabel(c, tc)}
                        </span>
                        <span className="text-ink-2 tabular">
                          {money(spent)} / {money(limit)}
                        </span>
                      </div>
                      <BudgetMeter
                        spent={spent}
                        limit={limit}
                        statusLabel={t(`budgetStatus.${budgetState(spent, limit)}`, {
                          pct: formatPercent(spent / limit, locale),
                        })}
                      />
                    </li>
                  ))}
                </ul>
              )}
              {budgetRows.length > 5 && (
                <p className="mt-4 text-xs text-ink-3">{t("moreBudgets", { count: budgetRows.length - 5 })}</p>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
