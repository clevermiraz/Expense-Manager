"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/app/actions/settings";
import { locales } from "@/i18n/config";

/**
 * Language switch for pages whose URL carries the language (the blog): goes to
 * the other language's URL and remembers the choice for the rest of the app.
 */
export function LanguageLinks({ hrefs }: { hrefs: Record<string, string> }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const [pending, startTransition] = useTransition();
  return (
    <div
      role="group"
      aria-label={t("language")}
      className={`inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-0.5 ${pending ? "opacity-60" : ""}`}
    >
      {locales.map((l) => (
        <a
          key={l}
          href={hrefs[l]}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          onClick={(e) => {
            e.preventDefault();
            if (l === locale) return;
            startTransition(async () => {
              await setLocale(l);
              // A full load: the root layout (html lang, menus) must switch language too.
              window.location.assign(hrefs[l]);
            });
          }}
          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors max-sm:py-2 ${
            l === locale ? "bg-primary text-white" : "text-ink-2 hover:bg-muted"
          }`}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
