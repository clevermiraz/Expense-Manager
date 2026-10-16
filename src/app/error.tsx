"use client";

import { RotateCw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { buttonClass } from "@/components/ui/button";

/** Shown when a page fails to render. The digest matches the server log entry. */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations("errorPage");
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-warn/12 text-warn">
        <TriangleAlert className="size-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">{t("title")}</h1>
      <p className="mt-2 max-w-md text-ink-2">{t("body")}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => retry()} className={buttonClass("primary", "md", "h-11 px-5")}>
          <RotateCw className="size-4" aria-hidden />
          {t("retry")}
        </button>
        <Link href="/" className={buttonClass("secondary", "md", "h-11 px-5")}>
          {t("home")}
        </Link>
      </div>
      {error.digest && <p className="mt-6 text-xs text-ink-3">{t("code", { code: error.digest })}</p>}
    </main>
  );
}
