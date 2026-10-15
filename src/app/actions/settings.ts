"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { isLocale, LOCALE_COOKIE } from "@/i18n/config";
import { requireUser } from "@/lib/session";
import { fieldErrors, profileInput } from "@/lib/validation";
import type { ActionResult } from "./result";

export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}

export async function updateProfile(input: {
  name: string;
  currency: string;
  timezone: string;
}): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = profileInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation", fields: fieldErrors(parsed.error) };
  await db.update(userTable).set(parsed.data).where(eq(userTable.id, user.id));
  revalidatePath("/", "layout");
  return { ok: true };
}
