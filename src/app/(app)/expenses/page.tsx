import { Download } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { AddExpenseButton } from "@/components/add-expense-button";
import { ExpenseFilters } from "@/components/expense-filters";
import { ExpenseList } from "@/components/expense-list";
import { MonthSwitcher } from "@/components/month-switcher";
import { PageHeader } from "@/components/page-header";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getExpenses } from "@/lib/data";
import { monthOf, resolveMonth } from "@/lib/dates";
import { formatMoney, formatNumber } from "@/lib/format";
import { requireUser, userToday } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("expenses") };
}

const UUID_RE = /^[0-9a-f-]{36}$/i;

export default async function ExpensesPage({ searchParams }: PageProps<"/expenses">) {
  const user = await requireUser();
  const sp = await searchParams;
  const currentMonth = monthOf(userToday(user));
  const month = resolveMonth(sp.month, currentMonth);
  const categoryId = typeof sp.category === "string" && UUID_RE.test(sp.category) ? sp.category : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : undefined;

  const [expenses, t, locale] = await Promise.all([
    getExpenses(user.id, { month, categoryId, q: q || undefined }),
    getTranslations("expenses"),
    getLocale(),
  ]);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const filtered = !!categoryId || !!q;

  return (
    <>
      <PageHeader
        title={t("title")}
        actions={
          <>
            <MonthSwitcher month={month} maxMonth={currentMonth} />
            <a href={`/api/export?month=${month}`} className={buttonClass("secondary", "md")} download>
              <Download className="size-4" aria-hidden />
              <span className="max-sm:sr-only">{t("export")}</span>
            </a>
          </>
        }
      />

      <Card>
        <ExpenseFilters />
        <div className="my-4 flex items-baseline justify-between gap-3 rounded-xl bg-muted px-4 py-3">
          <span className="text-sm text-ink-2">
            {filtered ? t("filteredTotal") : t("monthTotal")} ·{" "}
            {t("entries", { count: expenses.length, n: formatNumber(expenses.length, locale) })}
          </span>
          <span className="text-lg font-semibold text-ink tabular" data-testid="list-total">
            {formatMoney(total, user.currency, locale)}
          </span>
        </div>
        {expenses.length === 0 && !filtered ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-ink-3">{t("emptyMonth")}</p>
            <AddExpenseButton label={t("add")} />
          </div>
        ) : (
          <ExpenseList expenses={expenses} />
        )}
      </Card>
    </>
  );
}
