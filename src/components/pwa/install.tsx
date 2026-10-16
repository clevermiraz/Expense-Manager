"use client";

import { Download, Maximize2, MonitorSmartphone, Share, SquarePlus, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogBody } from "@/components/ui/dialog";
import { promptInstall, useInstallPlatform, type InstallPlatform } from "@/lib/pwa";

const SEEN_KEY = "hisab:install-prompt-seen";

function InstallDialog({ open, platform, onClose }: { open: boolean; platform: InstallPlatform; onClose: () => void }) {
  const t = useTranslations("install");
  const tc = useTranslations("common");
  const app = tc("appName");

  const steps: { text: string; icon?: ReactNode }[] =
    platform === "ios"
      ? [
          { text: t("iosStep1"), icon: <Share className="size-4" /> },
          { text: t("iosStep2", { app }), icon: <SquarePlus className="size-4" /> },
          { text: t("iosStep3", { app }) },
        ]
      : platform === "mac-safari"
        ? [{ text: t("macStep1") }, { text: t("macStep2") }, { text: t("macStep3", { app }) }]
        : [];

  return (
    <Dialog open={open} onClose={onClose} title={t("title", { app })} closeLabel={tc("close")}>
      <DialogBody>
        <div className="flex flex-col gap-5" data-testid="install-dialog">
          <div className="flex items-center gap-4">
            <Image src="/icons/icon-192.png" alt="" width={64} height={64} className="size-16 rounded-2xl shadow-md" />
            <p className="text-sm text-ink-2">{t("intro", { app })}</p>
          </div>

          {platform === "prompt" ? (
            <ul className="flex flex-col gap-3 rounded-2xl bg-muted p-4 text-sm text-ink">
              {[
                { icon: Zap, text: t("benefitFast") },
                { icon: Maximize2, text: t("benefitFull") },
                { icon: MonitorSmartphone, text: t("benefitDevices") },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          ) : (
            <ol className="flex flex-col gap-3 rounded-2xl bg-muted p-4 text-sm text-ink">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="flex-1 pt-0.5">{s.text}</span>
                  {s.icon && (
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface text-primary" aria-hidden>
                      {s.icon}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}

          {platform === "prompt" ? (
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                {t("notNow")}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  // prompt() must run inside the click, before anything async.
                  void promptInstall();
                  onClose();
                }}
              >
                <Download className="size-4" aria-hidden />
                {t("install")}
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={onClose}>
              {t("gotIt")}
            </Button>
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
}

/** Opens the install popup once, a moment after the first visit. */
export function InstallPrompt() {
  const platform = useInstallPlatform();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Skip automated browsers (e2e tests, crawlers) so the popup never covers the page.
    if (!platform || navigator.webdriver) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return;
    }
    const id = setTimeout(() => {
      // Don't stack on top of another dialog (e.g. the add-expense sheet); try again next visit.
      if (!document.querySelector("dialog[open]")) setOpen(true);
    }, 2500);
    return () => clearTimeout(id);
  }, [platform]);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, new Date().toISOString());
    } catch {}
  };

  return <InstallDialog open={open && !!platform} platform={platform} onClose={close} />;
}

/** Install button for places users can come back to after dismissing the popup. Hidden when not installable. */
export function InstallButton({ variant = "secondary", className = "" }: { variant?: "primary" | "secondary"; className?: string }) {
  const t = useTranslations("install");
  const platform = useInstallPlatform();
  const [open, setOpen] = useState(false);
  if (!platform) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => (platform === "prompt" ? void promptInstall() : setOpen(true))}
        className={buttonClass(variant, "md", className)}
      >
        <Download className="size-4" aria-hidden />
        {t("install")}
      </button>
      <InstallDialog open={open} platform={platform} onClose={() => setOpen(false)} />
    </>
  );
}

export function InstallCard() {
  const t = useTranslations("install");
  const tc = useTranslations("common");
  const platform = useInstallPlatform();
  if (!platform) return null;
  return (
    <Card>
      <CardHeader title={t("settingsTitle")} subtitle={t("settingsHint", { app: tc("appName") })} />
      <InstallButton variant="primary" />
    </Card>
  );
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Dev builds aren't content-hashed, so caching them would serve stale code.
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
  }, []);
  return null;
}
