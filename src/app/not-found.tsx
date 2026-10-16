import { Compass } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui/button";
import { whyPath } from "@/content/learn";

export default async function NotFound() {
  const [t, locale] = await Promise.all([getTranslations("notFound"), getLocale()]);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Compass className="size-7" aria-hidden />
      </span>
      <p className="mt-5 text-sm font-semibold text-primary">404</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">{t("title")}</h1>
      <p className="mt-2 max-w-md text-ink-2">{t("body")}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className={buttonClass("primary", "md", "h-11 px-5")}>
          {t("home")}
        </Link>
        <Link href={whyPath(locale)} className={buttonClass("secondary", "md", "h-11 px-5")}>
          {t("why")}
        </Link>
      </div>
    </main>
  );
}
