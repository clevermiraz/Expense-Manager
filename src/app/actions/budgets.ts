"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { budget, category } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { budgetInput, fieldErrors } from "@/lib/validation";
import type { ActionResult } from "./result";

/** amount = null removes the budget. categoryId = null is the overall budget. */
export async function setBudget(categoryId: string | null, amount: number | string | null): Promise<ActionResult> {
  const user = await requireUser();
  const normalized = amount === "" || amount === 0 || amount === "0" ? null : amount;
  const parsed = budgetInput.safeParse({ categoryId, amount: normalized });
  if (!parsed.success) return { ok: false, error: "validation", fields: fieldErrors(parsed.error) };
  const data = parsed.data;

  if (data.categoryId) {
    const [owned] = await db
      .select({ id: category.id })
      .from(category)
      .where(and(eq(category.id, data.categoryId), eq(category.userId, user.id)));
    if (!owned) return { ok: false, error: "notFound" };
  }

  const match = and(
    eq(budget.userId, user.id),
    data.categoryId ? eq(budget.categoryId, data.categoryId) : isNull(budget.categoryId),
  );

  if (data.amount === null) {
    await db.delete(budget).where(match);
  } else {
    await db
      .insert(budget)
      .values({ userId: user.id, categoryId: data.categoryId, amount: data.amount })
      .onConflictDoUpdate({
        target: [budget.userId, budget.categoryId],
        set: { amount: data.amount, updatedAt: new Date() },
      });
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
