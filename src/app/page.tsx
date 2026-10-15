import { CalendarDays, ChartColumn, Languages, Target } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { buttonClass } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  if (await getCurrentUser()) redirect("/dashboard");
  const [t, tc] = await Promise.all([getTranslations("landing"), getTranslations("common")]);
  const features = [
    { icon: CalendarDays, title: t("f1Title"), body: t("f1Body") },
    { icon: ChartColumn, title: t("f2Title"), body: t("f2Body") },
    { icon: Target, title: t("f3Title"), body: t("f3Body") },
    { icon: Languages, title: t("f4Title"), body: t("f4Body") },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo name={tc("appName")} />
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <Link href="/login" className={buttonClass("ghost", "sm")}>
            {t("login")}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        <section className="py-14 text-center sm:py-20">
          <h1 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{t("headline")}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-2">{t("subhead")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className={buttonClass("primary", "md", "h-11 px-6")}>
              {t("cta")}
            </Link>
            <Link href="/login" className={buttonClass("secondary", "md", "h-11 px-6")}>
              {t("login")}
            </Link>
          </div>
        </section>

        <section className="grid gap-4 pb-20 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-line bg-surface p-5">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-3 font-semibold text-ink">{title}</h2>
              <p className="mt-1 text-sm text-ink-2">{body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-line py-6 text-center text-xs text-ink-3">{tc("tagline")}</footer>
    </div>
  );
}
