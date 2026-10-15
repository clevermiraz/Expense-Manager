import "server-only";
import { and, asc, desc, eq, gte, ilike, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { budget, category, expense } from "@/db/schema";
import { addMonths, monthRange } from "@/lib/dates";
import { DEFAULT_CATEGORIES, FALLBACK_CATEGORY_KEY } from "@/lib/default-categories";

// Every function takes the userId explicitly and filters by it. Callers get it
// from requireUser(), never from client input.

export type Category = {
  id: string;
  key: string | null;
  name: string | null;
  icon: string;
  color: string;
};

const DEFAULT_ORDER = new Map(DEFAULT_CATEGORIES.map((c, i) => [c.key as string, i]));

/** Built-ins in their intended order (Food first, Other last), then custom ones by creation. */
export async function getCategories(userId: string): Promise<Category[]> {
  const rows = await db
    .select({
      id: category.id,
      key: category.key,
      name: category.name,
      icon: category.icon,
      color: category.color,
    })
    .from(category)
    .where(eq(category.userId, userId))
    .orderBy(asc(category.createdAt));
  const rank = (c: Category) =>
    c.key === FALLBACK_CATEGORY_KEY ? 2 : c.key && DEFAULT_ORDER.has(c.key) ? 0 : 1;
  return rows.sort(
    (a, b) => rank(a) - rank(b) || (DEFAULT_ORDER.get(a.key ?? "") ?? 0) - (DEFAULT_ORDER.get(b.key ?? "") ?? 0),
  );
}

export type ExpenseRow = {
  id: string;
  amount: number;
  spentOn: string;
  note: string | null;
  paymentMethod: string;
  categoryId: string;
};

export async function getExpenses(
  userId: string,
  opts: { month: string; categoryId?: string; q?: string },
): Promise<ExpenseRow[]> {
  const { start, end } = monthRange(opts.month);
  const conditions = [
    eq(expense.userId, userId),
    gte(expense.spentOn, start),
    lt(expense.spentOn, end),
  ];
  if (opts.categoryId) conditions.push(eq(expense.categoryId, opts.categoryId));
  if (opts.q) {
    const escaped = opts.q.replace(/[\\%_]/g, (c) => `\\${c}`);
    conditions.push(ilike(expense.note, `%${escaped}%`));
  }
  return db
    .select({
      id: expense.id,
      amount: expense.amount,
      spentOn: expense.spentOn,
      note: expense.note,
      paymentMethod: expense.paymentMethod,
      categoryId: expense.categoryId,
    })
    .from(expense)
    .where(and(...conditions))
    .orderBy(desc(expense.spentOn), desc(expense.createdAt));
}

export async function getRecentExpenses(userId: string, limit = 6): Promise<ExpenseRow[]> {
  return db
    .select({
      id: expense.id,
      amount: expense.amount,
      spentOn: expense.spentOn,
      note: expense.note,
      paymentMethod: expense.paymentMethod,
      categoryId: expense.categoryId,
    })
    .from(expense)
    .where(eq(expense.userId, userId))
    .orderBy(desc(expense.spentOn), desc(expense.createdAt))
    .limit(limit);
}

const num = (v: unknown) => Number(v ?? 0);

export type MonthSummary = {
  total: number;
  count: number;
  byCategory: { categoryId: string; total: number; count: number }[];
  byDay: { day: string; total: number }[];
};

export async function getMonthSummary(userId: string, month: string): Promise<MonthSummary> {
  const { start, end } = monthRange(month);
  const inMonth = and(eq(expense.userId, userId), gte(expense.spentOn, start), lt(expense.spentOn, end));

  const [byCategory, byDay] = await Promise.all([
    db
      .select({
        categoryId: expense.categoryId,
        total: sql<string>`sum(${expense.amount})`,
        count: sql<number>`count(*)::int`,
      })
      .from(expense)
      .where(inMonth)
      .groupBy(expense.categoryId)
      .orderBy(sql`sum(${expense.amount}) desc`),
    db
      .select({ day: expense.spentOn, total: sql<string>`sum(${expense.amount})` })
      .from(expense)
      .where(inMonth)
      .groupBy(expense.spentOn)
      .orderBy(asc(expense.spentOn)),
  ]);

  const cats = byCategory.map((r) => ({ categoryId: r.categoryId, total: num(r.total), count: r.count }));
  return {
    total: cats.reduce((s, c) => s + c.total, 0),
    count: cats.reduce((s, c) => s + c.count, 0),
    byCategory: cats,
    byDay: byDay.map((r) => ({ day: r.day, total: num(r.total) })),
  };
}

/** Totals per (month, category) for the `count` months ending at `endMonth`. */
export async function getCategoryMonthMatrix(
  userId: string,
  endMonth: string,
  count: number,
): Promise<{ month: string; categoryId: string; total: number }[]> {
  const start = `${addMonths(endMonth, -(count - 1))}-01`;
  const end = monthRange(endMonth).end;
  const monthExpr = sql<string>`to_char(${expense.spentOn}, 'YYYY-MM')`;
  const rows = await db
    .select({ month: monthExpr, categoryId: expense.categoryId, total: sql<string>`sum(${expense.amount})` })
    .from(expense)
    .where(and(eq(expense.userId, userId), gte(expense.spentOn, start), lt(expense.spentOn, end)))
    .groupBy(monthExpr, expense.categoryId);
  return rows.map((r) => ({ month: r.month, categoryId: r.categoryId, total: num(r.total) }));
}

/** Spending per weekday (0 = Sunday) for the given month range. */
export async function getWeekdayTotals(userId: string, startMonth: string, endMonth: string) {
  const start = `${startMonth}-01`;
  const end = monthRange(endMonth).end;
  const dow = sql<number>`extract(dow from ${expense.spentOn})::int`;
  const rows = await db
    .select({ dow, total: sql<string>`sum(${expense.amount})` })
    .from(expense)
    .where(and(eq(expense.userId, userId), gte(expense.spentOn, start), lt(expense.spentOn, end)))
    .groupBy(dow);
  const out = Array.from({ length: 7 }, (_, i) => ({ dow: i, total: 0 }));
  for (const r of rows) out[r.dow].total = num(r.total);
  return out;
}

export type Budgets = { overall: number | null; byCategory: Map<string, number> };

export async function getBudgets(userId: string): Promise<Budgets> {
  const rows = await db
    .select({ categoryId: budget.categoryId, amount: budget.amount })
    .from(budget)
    .where(eq(budget.userId, userId));
  const byCategory = new Map<string, number>();
  let overall: number | null = null;
  for (const r of rows) {
    if (r.categoryId) byCategory.set(r.categoryId, num(r.amount));
    else overall = num(r.amount);
  }
  return { overall, byCategory };
}

/** First month with any expense, used to know how much history exists. */
export async function getFirstExpenseMonth(userId: string): Promise<string | null> {
  const [row] = await db
    .select({ first: sql<string | null>`to_char(min(${expense.spentOn}), 'YYYY-MM')` })
    .from(expense)
    .where(eq(expense.userId, userId));
  return row?.first ?? null;
}
