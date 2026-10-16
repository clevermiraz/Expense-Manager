"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/app/actions/settings";
import { locales } from "@/i18n/config";

const LABELS: Record<string, string> = { en: "English", bn: "বাংলা" };

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={`inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-0.5 ${pending ? "opacity-60" : ""}`}
    >
      {!compact && <Languages className="ml-1.5 size-4 text-ink-3" aria-hidden />}
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await setLocale(l);
              router.refresh();
            })
          }
          className={`rounded-lg px-2.5 py-1 text-xs max-sm:py-2 font-medium transition-colors cursor-pointer ${
            l === locale ? "bg-primary text-white" : "text-ink-2 hover:bg-muted"
          }`}
        >
          {compact ? l.toUpperCase() : LABELS[l]}
        </button>
      ))}
    </div>
  );
}
