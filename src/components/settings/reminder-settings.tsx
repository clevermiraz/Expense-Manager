"use client";

import { BellOff, BellRing, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { sendTestReminder, setReminderHour } from "@/app/actions/reminders";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { formatHour } from "@/lib/format";
import { useReminder } from "@/lib/push-client";
import { useErrorText } from "@/lib/use-error-text";

// Evening first: that's when the day's spending is done. Morning for early birds.
const HOURS = [18, 19, 20, 21, 22, 23, 7, 8, 9, 12];

export function ReminderSettings({ hour: initialHour }: { hour: number }) {
  const t = useTranslations("reminderSettings");
  const te = useErrorText();
  const locale = useLocale();
  const { state, busy, enable, disable } = useReminder();
  const [hour, setHour] = useState(initialHour);
  const [testing, startTest] = useTransition();
  const hours = HOURS.includes(initialHour) ? HOURS : [initialHour, ...HOURS];

  const note =
    state === "needs-install" ? t("needsInstall") : state === "denied" ? t("denied") : state === "unsupported" ? t("unsupported") : null;

  return (
    <Card>
      <CardHeader title={t("title")} subtitle={t("hint")} />
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-2">{t("time")}</span>
          <Select
            value={hour}
            onChange={async (e) => {
              const next = Number(e.target.value);
              setHour(next);
              const res = await setReminderHour(next);
              toast(res.ok ? t("saved") : te(res.error), res.ok ? "success" : "error");
            }}
            className="sm:max-w-56"
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {formatHour(h, locale)}
              </option>
            ))}
          </Select>
        </label>

        {note ? (
          <p className="flex items-start gap-2 rounded-2xl bg-muted px-3 py-2.5 text-sm text-ink-2">
            <Info className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden />
            {note}
          </p>
        ) : state === "on" ? (
          <>
            <p className="flex items-center gap-2 text-sm font-medium text-good" data-testid="reminder-on">
              <BellRing className="size-4" aria-hidden />
              {t("enabled")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                loading={testing}
                onClick={() =>
                  startTest(async () => {
                    const res = await sendTestReminder();
                    toast(res.ok ? t("testSent") : te(res.error), res.ok ? "success" : "error");
                  })
                }
              >
                {t("test")}
              </Button>
              <Button variant="ghost" loading={busy} onClick={disable}>
                <BellOff className="size-4" aria-hidden />
                {t("turnOff")}
              </Button>
            </div>
          </>
        ) : (
          <Button
            className="self-start"
            loading={busy || state === "checking"}
            onClick={async () => {
              // A blocked or dismissed permission prompt explains itself; only real failures get a toast.
              if (!(await enable(hour)) && Notification.permission === "granted") toast(t("enableFailed"), "error");
            }}
          >
            <BellRing className="size-4" aria-hidden />
            {t("turnOn")}
          </Button>
        )}
      </div>
    </Card>
  );
}
