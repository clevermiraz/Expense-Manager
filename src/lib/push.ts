import "server-only";
import { inArray } from "drizzle-orm";
import { createTranslator } from "next-intl";
import webpush from "web-push";
import { db } from "@/db";
import { pushSubscription } from "@/db/schema";
import { isLocale, type Locale } from "@/i18n/config";
import type { LoggingStreak } from "@/lib/data";
import bn from "../../messages/bn.json";
import en from "../../messages/en.json";

export type PushRow = typeof pushSubscription.$inferSelect;
export type PushPayload = { title: string; body: string; url: string; tag: string };

let configured = false;

/** False when the VAPID keys aren't set (e.g. a fresh checkout); push is then skipped. */
export function pushEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && !!process.env.VAPID_PRIVATE_KEY;
}

function configure() {
  if (configured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:admin@hisab.app",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  configured = true;
}

/**
 * Sends to each subscription and deletes the ones the push service says are
 * gone (the app was uninstalled or notifications were turned off).
 */
export async function sendPush(subs: PushRow[], payload: (sub: PushRow) => PushPayload): Promise<number> {
  if (!pushEnabled() || subs.length === 0) return 0;
  configure();
  const gone: string[] = [];
  let sent = 0;
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload(sub)),
          { TTL: 60 * 60 * 6, urgency: "normal" },
        );
        sent++;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) gone.push(sub.id);
        else console.error("[push] send failed", status ?? err);
      }
    }),
  );
  if (gone.length) await db.delete(pushSubscription).where(inArray(pushSubscription.id, gone));
  return sent;
}

/**
 * The daily nudge, in the language the user subscribed in. Uses their streak
 * (loss aversion: "don't break it") and otherwise rotates a few gentle lines
 * so it doesn't read like the same robot every evening.
 */
export function reminderPayload(locale: string, streak: LoggingStreak, today: string): PushPayload {
  const loc: Locale = isLocale(locale) ? locale : "bn";
  const t = createTranslator({ locale: loc, messages: loc === "bn" ? bn : en, namespace: "reminders" });
  const n = new Intl.NumberFormat(loc === "bn" ? "bn-BD" : "en-US").format(streak.days);
  const variant = Number(today.slice(8, 10)) % 3;
  const [title, body] =
    streak.days >= 2
      ? [t("streakTitle", { n }), t("streakBody")]
      : streak.days === 1
        ? [t("startedTitle"), t("startedBody")]
        : [t("plainTitle"), t(`plainBody${variant}` as "plainBody0")];
  // Opens the app straight into the add sheet.
  return { title, body, url: "/dashboard?add=1", tag: "daily-reminder" };
}
