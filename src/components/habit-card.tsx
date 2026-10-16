"use client";

import { BellRing, Check, Flame, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useApp } from "@/components/app-context";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { LoggingStreak } from "@/lib/data";
import { formatDay, formatHour, formatNumber } from "@/lib/format";
import { useReminder } from "@/lib/push-client";

const DISMISS_KEY = "hisab:reminder-ask-dismissed";
const ASK_AGAIN_AFTER = 7 * 24 * 60 * 60 * 1000;

/**
 * The logging habit at a glance: the streak (and a nudge not to break it),
 * the last 7 days, and, once someone is actually logging, an offer to remind
 * them in the evening.
 */
export function HabitCard({ streak, reminderHour }: { streak: LoggingStreak; reminderHour: number }) {
  const t = useTranslations("habit");
  const locale = useLocale();
  const { openExpense } = useApp();
  const { days, loggedToday, week } = streak;
  const n = formatNumber(days, locale);

  return (
    <section
      data-testid="habit-card"
      className="rounded-3xl border border-line/70 bg-surface p-4 shadow-card sm:p-5"
      aria-label={t("title")}
    >
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex size-11 shrink-0 items-center justify-center rounded-2xl ${
            days > 0 ? "bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-sm shadow-orange-500/30" : "bg-muted text-ink-3"
          }`}
        >
          <Flame className="size-5.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink-3">{t("title")}</p>
          <p className="text-lg font-semibold leading-tight text-ink" data-testid="streak">
            {days > 0 ? t("streak", { n, count: days }) : t("start")}
          </p>
        </div>
        {!loggedToday && (
          <Button size="sm" onClick={() => openExpense()} className="h-9 shrink-0 rounded-xl px-3.5">
            {t("addNow")}
          </Button>
        )}
      </div>

      <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label={t("week")}>
        {week.map((d, i) => {
          const isToday = i === week.length - 1;
          const label = formatDay(d.day, locale, { weekday: "long", day: "numeric", month: "short" });
          return (
            <li key={d.day} className="flex flex-col items-center gap-1">
              <span className="text-[11px] text-ink-3" aria-hidden>
                {formatDay(d.day, locale, { weekday: "narrow" })}
              </span>
              <span
                aria-label={d.logged ? t("dayLogged", { day: label }) : t("dayMissed", { day: label })}
                className={`inline-flex size-8 items-center justify-center rounded-full text-xs ${
                  d.logged
                    ? "bg-linear-to-br from-amber-400 to-orange-500 text-white"
                    : isToday
                      ? "border-2 border-dashed border-orange-400/70 text-ink-3"
                      : "bg-muted text-ink-3"
                }`}
              >
                {d.logged ? <Check className="size-4" strokeWidth={3} aria-hidden /> : null}
              </span>
            </li>
          );
        })}
      </ol>

      <p className={`mt-3 text-sm ${loggedToday ? "text-good" : "text-ink-2"}`}>
        {loggedToday ? t("loggedToday") : days > 0 ? t("notYet") : t("start")}
      </p>

      {(days > 0 || loggedToday) && <ReminderAsk hour={reminderHour} />}
    </section>
  );
}

/** Asked only after someone has started logging: that's when a reminder helps. */
function ReminderAsk({ hour }: { hour: number }) {
  const t = useTranslations("habit");
  const locale = useLocale();
  const { state, busy, enable } = useReminder();
  const [dismissed, setDismissed] = useState(true);
  const time = formatHour(hour, locale);

  useEffect(() => {
    const at = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    // localStorage is only readable after mounting.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(Date.now() - at < ASK_AGAIN_AFTER);
  }, []);

  if (dismissed || state !== "off") return null;
  return (
    <div className="mt-4 flex items-start gap-3 rounded-2xl bg-primary-soft/70 p-3" data-testid="reminder-ask">
      <BellRing className="mt-0.5 size-4.5 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink">{t("remindAsk", { time })}</p>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            loading={busy}
            onClick={async () => {
              if (await enable(hour)) toast(t("remindDone", { time }));
            }}
          >
            {t("remindOn")}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              localStorage.setItem(DISMISS_KEY, String(Date.now()));
              setDismissed(true);
            }}
          >
            {t("notNow")}
          </Button>
        </div>
      </div>
      <button
        type="button"
        aria-label={t("notNow")}
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, String(Date.now()));
          setDismissed(true);
        }}
        className="-m-1 rounded-lg p-1 text-ink-3 hover:bg-muted cursor-pointer"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
