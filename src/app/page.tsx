import { CalendarDays, ChartColumn, Languages, Target } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { CategoryIcon } from "@/components/category-icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { InstallButton } from "@/components/pwa/install";
import { ThemeToggle } from "@/components/theme";
import { buttonClass } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  if (await getCurrentUser()) redirect("/dashboard");
  const [t, tc, td, tcat, locale] = await Promise.all([
    getTranslations("landing"),
    getTranslations("common"),
    getTranslations("dashboard"),
    getTranslations("categories"),
    getLocale(),
  ]);
  const features = [
    { icon: CalendarDays, title: t("f1Title"), body: t("f1Body") },
    { icon: ChartColumn, title: t("f2Title"), body: t("f2Body") },
    { icon: Target, title: t("f3Title"), body: t("f3Body") },
    { icon: Languages, title: t("f4Title"), body: t("f4Body") },
  ];
  // Illustrative numbers for the app preview.
  const money = (v: number) => formatMoney(v, "BDT", locale, { whole: true });
  const preview = [
    { key: "food", icon: "utensils", color: "#f97316", value: 5200 },
    { key: "groceries", icon: "shopping-basket", color: "#16a34a", value: 3900 },
    { key: "transport", icon: "bus", color: "#0ea5e9", value: 1850 },
  ] as const;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      {/* background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem]">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-24 top-24 size-80 rounded-full bg-[#8b5cf6]/15 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 bg-page/70 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo name={tc("appName")} />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher compact />
            <ThemeToggle />
            <Link href="/login" className={buttonClass("ghost", "sm", "px-2.5")}>
              {t("login")}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        <section className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-balance text-ink sm:text-5xl">{t("headline")}</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-2 lg:mx-0">{t("subhead")}</p>
            <div className="mt-8 grid gap-3 sm:flex sm:justify-center lg:justify-start">
              <Link href="/register" className={buttonClass("primary", "md", "h-12 px-7 text-base")}>
                {t("cta")}
              </Link>
              <Link href="/login" className={buttonClass("secondary", "md", "h-12 px-7 text-base")}>
                {t("login")}
              </Link>
            </div>
            <div className="mt-3 flex justify-center lg:justify-start">
              <InstallButton className="h-11 border-dashed" />
            </div>
          </div>

          {/* App preview */}
          <div aria-hidden className="mx-auto w-full max-w-xs select-none">
            <div className="rounded-[2.5rem] border border-line/70 bg-surface p-3 shadow-float">
              <div className="rounded-[2rem] bg-page p-3">
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-from to-brand-to p-4 text-white">
                  <span className="absolute -right-8 -top-10 size-32 rounded-full bg-white/10 blur-2xl" />
                  <p className="text-xs text-white/80">{td("spentThisMonth")}</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight tabular">{money(12480)}</p>
                  <div className="mt-4 flex h-12 items-end gap-1">
                    {[30, 55, 20, 70, 45, 90, 35, 60, 25, 80, 50, 40].map((h, i) => (
                      <span key={i} className="flex-1 rounded-sm bg-white/70" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="mt-3 rounded-3xl bg-surface p-3">
                  <p className="mb-2 text-xs font-semibold text-ink">{td("byCategory")}</p>
                  <ul className="flex flex-col gap-2.5">
                    {preview.map((p) => (
                      <li key={p.key} className="flex items-center gap-2">
                        <CategoryIcon icon={p.icon} color={p.color} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between text-xs">
                            <span className="truncate text-ink">{tcat(p.key)}</span>
                            <span className="font-medium text-ink tabular">{money(p.value)}</span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-muted">
                            <div className="h-full rounded-full" style={{ width: `${(p.value / 5200) * 100}%`, backgroundColor: p.color }} />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 pb-16 sm:gap-4 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-line/70 bg-surface p-4 shadow-card sm:p-5">
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-3 text-sm font-semibold text-ink sm:text-base">{title}</h2>
              <p className="mt-1 text-xs text-ink-2 sm:text-sm">{body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-line px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-xs text-ink-3">
        {tc("tagline")}
      </footer>
    </div>
  );
}
