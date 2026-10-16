import { WifiOff } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("offline");
  return { title: t("title"), robots: { index: false } };
}

// Served by the service worker (public/sw.js) when a page can't be reached.
export default async function OfflinePage() {
  const [t, tc] = await Promise.all([getTranslations("offline"), getTranslations("common")]);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="inline-flex size-16 items-center justify-center rounded-3xl bg-primary-soft text-primary">
        <WifiOff className="size-8" aria-hidden />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">{t("title")}</h1>
      <p className="max-w-sm text-ink-2">{t("body", { app: tc("appName") })}</p>
      {/* A plain link (empty href = reload this URL) works even if JS didn't load. */}
      <a href="" className={buttonClass("primary", "md", "mt-2 h-11 px-6")}>
        {t("retry")}
      </a>
    </main>
  );
}
