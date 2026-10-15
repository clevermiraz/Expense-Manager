"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { category, expense } from "@/db/schema";
import { todayInTimeZone } from "@/lib/dates";
import { requireUser } from "@/lib/session";
import { expenseInput, fieldErrors, type ExpenseInput } from "@/lib/validation";
import type { ActionResult } from "./result";

async function ownsCategory(userId: string, categoryId: string) {
  const [row] = await db
    .select({ id: category.id })
    .from(category)
    .where(and(eq(category.id, categoryId), eq(category.userId, userId)));
  return !!row;
}

export async function saveExpense(id: string | null, input: ExpenseInput): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = expenseInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation", fields: fieldErrors(parsed.error) };
  const data = parsed.data;

  // Allow one day of slack for timezone edges; older than 2000 is a typo.
  const latest = todayInTimeZone(user.timezone, new Date(Date.now() + 86_400_000));
  if (data.spentOn > latest || data.spentOn < "2000-01-01") {
    return { ok: false, error: "validation", fields: { spentOn: "dateOutOfRange" } };
  }

  if (!(await ownsCategory(user.id, data.categoryId))) {
    return { ok: false, error: "validation", fields: { categoryId: "categoryRequired" } };
  }

  if (id) {
    const updated = await db
      .update(expense)
      .set(data)
      .where(and(eq(expense.id, id), eq(expense.userId, user.id)))
      .returning({ id: expense.id });
    if (updated.length === 0) return { ok: false, error: "notFound" };
  } else {
    await db.insert(expense).values({ ...data, userId: user.id });
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteExpense(id: string): Promise<ActionResult> {
  const user = await requireUser();
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: "notFound" };
  const deleted = await db
    .delete(expense)
    .where(and(eq(expense.id, id), eq(expense.userId, user.id)))
    .returning({ id: expense.id });
  if (deleted.length === 0) return { ok: false, error: "notFound" };
  revalidatePath("/", "layout");
  return { ok: true };
}
