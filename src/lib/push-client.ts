"use client";

import { useLocale } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { subscribeToReminders, unsubscribeFromReminders } from "@/app/actions/reminders";
import { isStandalone } from "@/lib/pwa";

/**
 * - "unsupported": this browser can't do web push (or keys aren't set up)
 * - "needs-install": iPhone/iPad, where push only works in the installed app
 * - "denied": the user blocked notifications in the browser
 * - "off" / "on": this device is (not) subscribed
 * - "checking": still finding out
 */
export type ReminderState = "checking" | "unsupported" | "needs-install" | "denied" | "off" | "on";

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function isIOS() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

function keyBytes(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(padded);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function registration() {
  const existing = await navigator.serviceWorker.getRegistration("/");
  if (existing) return existing;
  const url = process.env.NODE_ENV === "production" ? "/sw.js" : "/sw.js?dev";
  await navigator.serviceWorker.register(url, { scope: "/", updateViaCache: "none" });
  return navigator.serviceWorker.ready;
}

async function detect(): Promise<ReminderState> {
  if (isIOS() && !isStandalone()) return "needs-install";
  if (!VAPID_KEY || !("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "denied") return "denied";
  const reg = await navigator.serviceWorker.getRegistration("/");
  const sub = await reg?.pushManager.getSubscription();
  return sub && Notification.permission === "granted" ? "on" : "off";
}

/** Daily-reminder switch for this device. `enable` must be called from a tap. */
export function useReminder() {
  const locale = useLocale();
  const [state, setState] = useState<ReminderState>("checking");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    detect()
      .then((s) => alive && setState(s))
      .catch(() => alive && setState("unsupported"));
    return () => {
      alive = false;
    };
  }, []);

  const enable = useCallback(
    async (hour?: number): Promise<boolean> => {
      setBusy(true);
      try {
        // Asked only now, right after the user tapped "turn on".
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setState(permission === "denied" ? "denied" : "off");
          return false;
        }
        const reg = await registration();
        const sub =
          (await reg.pushManager.getSubscription()) ??
          (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(VAPID_KEY) }));
        const res = await subscribeToReminders(sub.toJSON(), locale, hour);
        setState(res.ok ? "on" : "off");
        return res.ok;
      } catch {
        setState(await detect().catch(() => "unsupported" as const));
        return false;
      } finally {
        setBusy(false);
      }
    },
    [locale],
  );

  const disable = useCallback(async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await unsubscribeFromReminders(sub.endpoint);
        await sub.unsubscribe();
      }
      setState("off");
    } finally {
      setBusy(false);
    }
  }, []);

  return { state, busy, enable, disable };
}
