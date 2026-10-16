import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { expense, pushSubscription, reminder, user } from "@/db/schema";
import { getLoggingStreak } from "@/lib/data";
import { hourInTimeZone, isValidTimeZone, todayInTimeZone } from "@/lib/dates";
import { pushEnabled, reminderPayload, sendPush } from "@/lib/push";

/**
 * Daily reminder job. Call it every 15–60 minutes (Vercel Cron, or cron + curl)
 * with `Authorization: Bearer <CRON_SECRET>`.
 *
 * A user is reminded at most once per local day, at or after their chosen
 * hour, and only if they haven't added any expense that day.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!pushEnabled()) return Response.json({ error: "push not configured" }, { status: 503 });

  const now = new Date();
  const due = await db
    .select({ userId: reminder.userId, hour: reminder.hour, lastSentOn: reminder.lastSentOn, timezone: user.timezone })
    .from(reminder)
    .innerJoin(user, eq(user.id, reminder.userId))
    .where(eq(reminder.enabled, true));

  let checked = 0;
  let sent = 0;
  for (const r of due) {
    const tz = isValidTimeZone(r.timezone) ? r.timezone : "Asia/Dhaka";
    const today = todayInTimeZone(tz, now);
    if (r.lastSentOn === today || hourInTimeZone(tz, now) < r.hour) continue;
    checked++;

    // Anything written down today (in their timezone)? Then no nudge needed.
    const [{ added }] = await db
      .select({ added: sql<number>`count(*)::int` })
      .from(expense)
      .where(and(eq(expense.userId, r.userId), sql`(${expense.createdAt} at time zone ${tz})::date = ${today}::date`));
    if (added > 0) continue;

    const subs = await db.select().from(pushSubscription).where(eq(pushSubscription.userId, r.userId));
    if (subs.length === 0) continue;
    const streak = await getLoggingStreak(r.userId, today);
    const n = await sendPush(subs, (s) => reminderPayload(s.locale, streak, today));
    if (n > 0) {
      sent += n;
      await db.update(reminder).set({ lastSentOn: today }).where(eq(reminder.userId, r.userId));
    }
  }
  return Response.json({ users: due.length, checked, sent });
}
