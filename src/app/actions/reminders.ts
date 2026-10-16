"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { pushSubscription, reminder } from "@/db/schema";
import { getLoggingStreak } from "@/lib/data";
import { locales } from "@/i18n/config";
import { pushEnabled, reminderPayload, sendPush } from "@/lib/push";
import { requireUser, userToday } from "@/lib/session";
import type { ActionResult } from "./result";

const subscriptionInput = z.object({
  endpoint: z.url().max(1000),
  keys: z.object({ p256dh: z.string().min(1).max(200), auth: z.string().min(1).max(100) }),
});
const hourInput = z.number().int().min(0).max(23);

/** Saves this browser's push subscription and turns the daily reminder on. */
export async function subscribeToReminders(
  sub: unknown,
  locale: string,
  hour?: number,
): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = subscriptionInput.safeParse(sub);
  if (!parsed.success) return { ok: false, error: "generic" };
  const { endpoint, keys } = parsed.data;
  const loc = (locales as readonly string[]).includes(locale) ? locale : "bn";
  const h = hourInput.safeParse(hour);

  await db
    .insert(pushSubscription)
    .values({ userId: user.id, endpoint, p256dh: keys.p256dh, auth: keys.auth, locale: loc })
    // The same browser may have been used by another account before.
    .onConflictDoUpdate({
      target: pushSubscription.endpoint,
      set: { userId: user.id, p256dh: keys.p256dh, auth: keys.auth, locale: loc },
    });
  await db
    .insert(reminder)
    .values({ userId: user.id, enabled: true, ...(h.success ? { hour: h.data } : {}) })
    .onConflictDoUpdate({ target: reminder.userId, set: { enabled: true, ...(h.success ? { hour: h.data } : {}) } });
  revalidatePath("/settings");
  return { ok: true };
}

/** Removes this browser's subscription; reminders stop once no device is left. */
export async function unsubscribeFromReminders(endpoint: string): Promise<ActionResult> {
  const user = await requireUser();
  await db
    .delete(pushSubscription)
    .where(and(eq(pushSubscription.userId, user.id), eq(pushSubscription.endpoint, endpoint)));
  const left = await db
    .select({ id: pushSubscription.id })
    .from(pushSubscription)
    .where(eq(pushSubscription.userId, user.id))
    .limit(1);
  if (left.length === 0) await db.update(reminder).set({ enabled: false }).where(eq(reminder.userId, user.id));
  revalidatePath("/settings");
  return { ok: true };
}

export async function setReminderHour(hour: number): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = hourInput.safeParse(hour);
  if (!parsed.success) return { ok: false, error: "validation" };
  await db
    .insert(reminder)
    .values({ userId: user.id, hour: parsed.data, enabled: false })
    .onConflictDoUpdate({ target: reminder.userId, set: { hour: parsed.data } });
  revalidatePath("/settings");
  return { ok: true };
}

/** Sends today's reminder right now to every device of this user. */
export async function sendTestReminder(): Promise<ActionResult<{ sent: number }>> {
  const user = await requireUser();
  if (!pushEnabled()) return { ok: false, error: "pushUnavailable" };
  const subs = await db.select().from(pushSubscription).where(eq(pushSubscription.userId, user.id));
  if (subs.length === 0) return { ok: false, error: "pushUnavailable" };
  const today = userToday(user);
  const streak = await getLoggingStreak(user.id, today);
  const sent = await sendPush(subs, (s) => reminderPayload(s.locale, streak, today));
  return sent > 0 ? { ok: true, data: { sent } } : { ok: false, error: "pushUnavailable" };
}
