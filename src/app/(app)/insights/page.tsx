import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { SpendBarChart } from "@/components/charts/bar-chart";
import { HeatmapTable } from "@/components/charts/heatmap-table";
import { CategoryIcon } from "@/components/category-icon";
import { PageHeader } from "@/components/page-header";
import { StatTile } from "@/components/stat-tile";
import { Card, CardHeader, EmptyState } from "@/components/ui/card";
import { categoryLabel } from "@/lib/category-label";
import { getCategories, getCategoryMonthMatrix, getFirstExpenseMonth, getWeekdayTotals } from "@/lib/data";
import { monthOf, monthsEndingAt } from "@/lib/dates";
import { formatCompact, formatMoney, formatMonth, formatMonthName, formatPercent, formatWeekday } from "@/lib/format";
import { requireUser, userToday } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("insights") };
}

const RANGES = [3, 6, 12] as const;

export default async function InsightsPage({ searchParams }: PageProps<"/insights">) {
  const user = await requireUser();
  const sp = await searchParams;
  const range = RANGES.find((r) => String(r) === sp.range) ?? 6;
  const currentMonth = monthOf(userToday(user));
  const months = monthsEndingAt(currentMonth, range);

  const [matrix, weekdays, categories, firstMonth, t, tc, locale] = await Promise.all([
    getCategoryMonthMatrix(user.id, currentMonth, range),
    getWeekdayTotals(user.id, months[0], currentMonth),
    getCategories(user.id),
    getFirstExpenseMonth(user.id),
    getTranslations("insights"),
    getTranslations("categories"),
    getLocale(),
  ]);

  // Everything on this page is a sum or an average: show whole amounts.
  const money = (v: number) => formatMoney(v, user.currency, locale, { whole: true });
  const compact = (v: number) => formatCompact(v, locale);

  const header = (
    <PageHeader
      title={t("title")}
      subtitle={t("subtitle")}
      actions={
        <div role="group" aria-label={t("range")} className="inline-flex rounded-xl border border-line bg-surface p-0.5">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/insights?range=${r}`}
              aria-current={r === range ? "true" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                r === range ? "bg-primary text-white" : "text-ink-2 hover:bg-muted"
              }`}
            >
              {t("months", { count: r })}
            </Link>
          ))}
        </div>
      }
    />
  );

  if (!firstMonth || matrix.length === 0) {
    return (
      <>
        {header}
        <Card>
          <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
        </Card>
      </>
    );
  }

  // Month totals and the category x month grid.
  const monthTotals = new Map<string, number>(months.map((m) => [m, 0]));
  const grid = new Map<string, Map<string, number>>();
  for (const r of matrix) {
    monthTotals.set(r.month, (monthTotals.get(r.month) ?? 0) + r.total);
    if (!grid.has(r.categoryId)) grid.set(r.categoryId, new Map());
    grid.get(r.categoryId)!.set(r.month, r.total);
  }

  // Averages only count complete months that you were actually tracking.
  const completeMonths = months.filter((m) => m < currentMonth && m >= firstMonth);
  const avgBase = completeMonths.length > 0 ? completeMonths : [currentMonth];
  const avgOf = (perMonth: (m: string) => number) =>
    avgBase.reduce((s, m) => s + perMonth(m), 0) / avgBase.length;

  const avgMonthly = avgOf((m) => monthTotals.get(m) ?? 0);
  const ranked = completeMonths
    .map((m) => ({ m, total: monthTotals.get(m) ?? 0 }))
    .sort((a, b) => b.total - a.total);
  const highest = ranked[0];
  const lowest = ranked[ranked.length - 1];
  const rangeTotal = [...monthTotals.values()].reduce((s, v) => s + v, 0);

  const catById = new Map(categories.map((c) => [c.id, c]));
  const catRows = [...grid.entries()]
    .map(([categoryId, byMonth]) => {
      const values = months.map((m) => byMonth.get(m) ?? 0);
      return {
        categoryId,
        values,
        total: values.reduce((s, v) => s + v, 0),
        avg: avgOf((m) => byMonth.get(m) ?? 0),
      };
    })
    .sort((a, b) => b.total - a.total);
  const top = catRows[0];
  const top3Share = catRows.slice(0, 3).reduce((s, r) => s + r.total, 0) / Math.max(1, rangeTotal);

  // The table starts at the first month with any expense; earlier columns would be all "–".
  const heatStart = Math.max(0, months.findIndex((m) => m >= firstMonth));
  const heatMonths = months.slice(heatStart);

  const trend = months.map((m) => ({
    key: m,
    tick: formatMonthName(m, locale),
    label: m === currentMonth ? `${formatMonth(m, locale)} · ${t("soFar")}` : formatMonth(m, locale),
    value: monthTotals.get(m) ?? 0,
    muted: m === currentMonth,
  }));

  const weekdayData = weekdays.map((w) => ({
    key: String(w.dow),
    tick: formatWeekday(w.dow, locale, "short"),
    label: formatWeekday(w.dow, locale, "long"),
    value: w.total,
  }));
  const topWeekday = weekdays.reduce((a, b) => (b.total > a.total ? b : a));

  return (
    <>
      {header}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          testId="stat-avg-month"
          label={t("avgMonthly")}
          value={money(avgMonthly)}
          footer={completeMonths.length > 0 ? t("basedOn", { count: completeMonths.length }) : t("soFarOnly")}
        />
        <StatTile
          label={t("highestMonth")}
          value={highest ? money(highest.total) : "—"}
          footer={highest ? formatMonth(highest.m, locale) : t("needFullMonth")}
        />
        <StatTile
          label={t("lowestMonth")}
          value={lowest ? money(lowest.total) : "—"}
          footer={lowest ? formatMonth(lowest.m, locale) : t("needFullMonth")}
        />
        <StatTile
          label={t("topCategory")}
          value={top ? categoryLabel(catById.get(top.categoryId), tc) : "—"}
          footer={top ? t("shareOfSpending", { pct: formatPercent(top.total / Math.max(1, rangeTotal), locale) }) : null}
        />
      </div>

      {/* Advice needs a full month behind it; one week of data can't say much. */}
      {completeMonths.length > 0 && (
        <Card className="mt-4">
          <div className="flex items-start gap-3 text-sm text-ink-2">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
            <ul className="flex flex-col gap-1.5">
              {top && (
                <li>
                  {t("insightTop3", {
                    pct: formatPercent(top3Share, locale),
                    list: catRows
                      .slice(0, 3)
                      .map((r) => categoryLabel(catById.get(r.categoryId), tc))
                      .join(", "),
                  })}
                </li>
              )}
              {topWeekday.total > 0 && (
                <li>{t("insightWeekday", { day: formatWeekday(topWeekday.dow, locale, "long") })}</li>
              )}
              <li>{t("insightBudget", { amount: money(avgMonthly) })}</li>
            </ul>
          </div>
        </Card>
      )}

      <Card className="mt-4">
        <CardHeader title={t("monthlyTrend")} subtitle={t("monthlyTrendHint")} />
        <SpendBarChart data={trend} currency={user.currency} height={240} ariaLabel={t("monthlyTrend")} />
      </Card>

      <Card className="mt-4">
        <CardHeader title={t("whereMoneyGoes")} subtitle={t("whereMoneyGoesHint")} />
        <HeatmapTable
          caption={t("whereMoneyGoes")}
          categoryLabel={t("category")}
          averageLabel={t("avgPerMonth")}
          columns={heatMonths.map((m) => ({
            key: m,
            label: m === currentMonth ? `${formatMonth(m, locale, "short")}*` : formatMonth(m, locale, "short"),
          }))}
          rows={catRows.map((r) => {
            const c = catById.get(r.categoryId);
            return {
              id: r.categoryId,
              label: (
                <span className="flex min-w-0 items-center gap-2">
                  {c && <CategoryIcon icon={c.icon} color={c.color} size="sm" />}
                  <span className="truncate">{categoryLabel(c, tc)}</span>
                </span>
              ),
              values: r.values.slice(heatStart),
              total: r.total,
              average: r.avg > 0 ? money(r.avg) : "–",
            };
          })}
          format={compact}
        />
        <p className="mt-3 text-xs text-ink-3">{t("partialNote")}</p>
      </Card>

      <Card className="mt-4">
        <CardHeader title={t("byWeekday")} subtitle={t("byWeekdayHint", { count: range })} />
        <SpendBarChart data={weekdayData} currency={user.currency} height={200} ariaLabel={t("byWeekday")} />
      </Card>
    </>
  );
}
