import { ArrowRight, CalendarDays, ChartColumn, Languages, ShieldCheck, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { CategoryIcon } from "@/components/category-icon";
import { ArticleIcon } from "@/components/learn";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { InstallButton } from "@/components/pwa/install";
import { buttonClass } from "@/components/ui/button";
import { ARTICLES, blogPath, HIGHLIGHTS, localized, whyPath } from "@/content/learn";
import { formatMoney } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import { OG_IMAGE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("landing");
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: "/",
      images: [OG_IMAGE],
    },
  };
}

export default async function Home() {
  if (await getCurrentUser()) redirect("/dashboard");
  const [t, td, tcat, locale] = await Promise.all([
    getTranslations("landing"),
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

      <PublicHeader locale={locale} signedIn={false} />

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
            <p className="mt-3 text-xs text-ink-3">
              {t("trust")}
            </p>
            <div className="mt-3 flex justify-center lg:justify-start">
              <InstallButton className="h-11 border-dashed" />
            </div>
            <Link
              href={whyPath(locale)}
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("whyLink")}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
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

        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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

        {/* Why bother: the research, in three numbers, each linking to the article. */}
        <section className="py-16" aria-labelledby="why-title">
          <h2 id="why-title" className="text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {t("whyTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-ink-2">{t("whyBody")}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h.stat.en}>
                <Link
                  href={blogPath(locale, h.slug)}
                  className="group flex h-full flex-col rounded-3xl border border-line/70 bg-surface p-5 shadow-card transition-colors hover:bg-muted/40"
                >
                  <span className="text-4xl font-bold tracking-tight text-primary">{locale === "en" ? h.stat.en : h.stat.bn}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{locale === "en" ? h.en : h.bn}</span>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {t("whyMore")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="pb-16" aria-labelledby="guides-title">
          <div className="flex items-end justify-between gap-3">
            <h2 id="guides-title" className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {t("guidesTitle")}
            </h2>
            <Link href={blogPath(locale)} className="shrink-0 text-sm font-medium text-primary hover:underline">
              {t("allPosts")}
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ARTICLES.filter((a) => a.slug === "how-to-track-expenses" || a.slug === "monthly-budget").map((a) => {
              const text = localized(a, locale);
              return (
                <li key={a.slug}>
                  <Link
                    href={blogPath(locale, a.slug)}
                    className="flex h-full items-start gap-4 rounded-3xl border border-line/70 bg-surface p-4 shadow-card transition-colors hover:bg-muted/40 sm:p-5"
                  >
                    <ArticleIcon icon={a.icon} />
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug text-ink">{text.title}</span>
                      <span className="mt-1 block text-sm text-ink-3">{text.summary}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mb-14 rounded-3xl border border-line/70 bg-surface p-6 sm:p-8 text-center shadow-card">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-good/15 px-3 py-1 text-xs font-semibold text-good">
            <ShieldCheck className="size-3.5" aria-hidden />
            <span>{t("privacyBadge")}</span>
          </span>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">{t("privacyTitle")}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-2 leading-relaxed">{t("privacyBody")}</p>
        </section>

        <section className="mb-16 rounded-3xl bg-linear-to-br from-brand-from to-brand-to px-5 py-10 text-center text-white shadow-card">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("finalTitle")}</h2>
          <p className="mx-auto mt-2 max-w-md text-white/85">{t("finalBody")}</p>
          <Link href="/register" className={buttonClass("secondary", "md", "mt-6 h-12 border-transparent px-7 text-base")}>
            {t("cta")}
          </Link>
        </section>
      </main>

      <PublicFooter locale={locale} />
    </div>
  );
}
