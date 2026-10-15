"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { category, expense } from "@/db/schema";
import { FALLBACK_CATEGORY_KEY } from "@/lib/default-categories";
import { requireUser } from "@/lib/session";
import { categoryInput, fieldErrors } from "@/lib/validation";
import type { ActionResult } from "./result";

const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v);

async function nameTaken(userId: string, name: string, exceptId?: string) {
  const rows = await db
    .select({ id: category.id })
    .from(category)
    .where(and(eq(category.userId, userId), sql`lower(${category.name}) = lower(${name})`));
  return rows.some((r) => r.id !== exceptId);
}

export async function createCategory(input: { name: string; color: string; icon: string }): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = categoryInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation", fields: fieldErrors(parsed.error) };
  if (await nameTaken(user.id, parsed.data.name)) {
    return { ok: false, error: "validation", fields: { name: "nameTaken" } };
  }
  await db.insert(category).values({ ...parsed.data, userId: user.id });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateCategory(
  id: string,
  input: { name?: string; color: string; icon: string },
): Promise<ActionResult> {
  const user = await requireUser();
  if (!isUuid(id)) return { ok: false, error: "notFound" };
  const [existing] = await db
    .select({ key: category.key })
    .from(category)
    .where(and(eq(category.id, id), eq(category.userId, user.id)));
  if (!existing) return { ok: false, error: "notFound" };

  // Built-in categories keep their translated name; only look can change.
  const schema = existing.key ? categoryInput.omit({ name: true }) : categoryInput;
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation", fields: fieldErrors(parsed.error) };
  const data = parsed.data as { name?: string; color: string; icon: string };
  if (data.name && (await nameTaken(user.id, data.name, id))) {
    return { ok: false, error: "validation", fields: { name: "nameTaken" } };
  }
  await db.update(category).set(data).where(and(eq(category.id, id), eq(category.userId, user.id)));
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const user = await requireUser();
  if (!isUuid(id)) return { ok: false, error: "notFound" };

  return db.transaction(async (tx) => {
    const [target] = await tx
      .select({ id: category.id, key: category.key })
      .from(category)
      .where(and(eq(category.id, id), eq(category.userId, user.id)));
    if (!target) return { ok: false, error: "notFound" } as const;
    if (target.key === FALLBACK_CATEGORY_KEY) return { ok: false, error: "cannotDeleteOther" } as const;

    const [fallback] = await tx
      .select({ id: category.id })
      .from(category)
      .where(and(eq(category.userId, user.id), eq(category.key, FALLBACK_CATEGORY_KEY)));
    let fallbackId = fallback?.id;
    if (!fallbackId) {
      const [created] = await tx
        .insert(category)
        .values({ userId: user.id, key: FALLBACK_CATEGORY_KEY, icon: "tag", color: "#64748b" })
        .returning({ id: category.id });
      fallbackId = created.id;
    }

    await tx
      .update(expense)
      .set({ categoryId: fallbackId })
      .where(and(eq(expense.categoryId, id), eq(expense.userId, user.id)));
    await tx.delete(category).where(and(eq(category.id, id), eq(category.userId, user.id)));
    revalidatePath("/", "layout");
    return { ok: true } as const;
  });
}
