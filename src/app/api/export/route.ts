import { and, asc, eq, gte, lt } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { db } from "@/db";
import { category, expense } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { isValidMonth, monthRange } from "@/lib/dates";

function csvCell(value: string | number | null): string {
  let s = value === null ? "" : String(value);
  // Neutralize spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const month = new URL(request.url).searchParams.get("month");
  const conditions = [eq(expense.userId, user.id)];
  if (isValidMonth(month)) {
    const { start, end } = monthRange(month);
    conditions.push(gte(expense.spentOn, start), lt(expense.spentOn, end));
  }

  const [rows, t, tc, tp] = await Promise.all([
    db
      .select({
        spentOn: expense.spentOn,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod,
        note: expense.note,
        key: category.key,
        name: category.name,
      })
      .from(expense)
      .innerJoin(category, eq(category.id, expense.categoryId))
      .where(and(...conditions))
      .orderBy(asc(expense.spentOn), asc(expense.createdAt)),
    getTranslations("export"),
    getTranslations("categories"),
    getTranslations("paymentMethods"),
  ]);

  const header = [t("date"), t("category"), t("amount"), t("paymentMethod"), t("note")];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [r.spentOn, r.key ? tc(r.key) : r.name, r.amount.toFixed(2), tp(r.paymentMethod), r.note]
        .map((v) => csvCell(v ?? null))
        .join(","),
    );
  }

  const filename = `expenses-${isValidMonth(month) ? month : "all"}.csv`;
  // BOM so Excel opens UTF-8 (Bangla) correctly.
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
