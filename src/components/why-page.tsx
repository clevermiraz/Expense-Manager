import {
  ArrowRight,
  BellRing,
  ChartColumn,
  Check,
  CheckCircle2,
  Download,
  HandCoins,
  Lock,
  Minus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { buttonClass } from "@/components/ui/button";
import { blogPath, HIGHLIGHTS, whyPath } from "@/content/learn";
import { pick, WHY } from "@/content/why";
import { getCurrentUser } from "@/lib/session";
import { OG_IMAGE, SITE_URL } from "@/lib/site";

const ICONS = {
  zap: Zap,
  chart: ChartColumn,
  target: Target,
  handcoins: HandCoins,
  bell: BellRing,
  phone: Smartphone,
} as const;

const languages = { bn: whyPath("bn"), en: whyPath("en"), "x-default": whyPath("bn") };

export function whyMetadata(locale: string): Metadata {
  const title = pick(WHY.meta.title, locale);
  const description = pick(WHY.meta.description, locale);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: whyPath(locale), languages },
    openGraph: {
      type: "website",
      title,
      description,
      url: "/",
      locale: locale === "en" ? "en_US" : "bn_BD",
      images: [OG_IMAGE],
    },
  };
}

function Cell({ value, locale }: { value: "yes" | "partly" | "no" | "free"; locale: string }) {
  const label = pick(WHY.compare.legend[value], locale);
  if (value === "yes") return <Check className="mx-auto size-5 text-good" strokeWidth={3} aria-label={label} />;
  if (value === "no") return <X className="mx-auto size-5 text-ink-3" aria-label={label} />;
  if (value === "free") return <span className="text-xs font-semibold text-good">{label}</span>;
  return (
    <span className="inline-flex flex-col items-center gap-0.5 text-[11px] leading-tight text-ink-3">
      <Minus className="size-4" aria-hidden />
      {label}
    </span>
  );
}

export async function WhyPage({ locale }: { locale: string }) {
  const user = await getCurrentUser();
  const t = (text: { bn: string; en: string }) => pick(text, locale);

  const previewItems = locale === "en"
    ? [
        { key: "1", icon: "utensils", color: "#f97316", name: "Lunch & snacks", sub: "Food & dining", amount: "৳125", baki: false },
        { key: "2", icon: "shopping-basket", color: "#16a34a", name: "Groceries (due)", sub: "Corner shop", amount: "৳550", baki: true },
        { key: "3", icon: "bus", color: "#0ea5e9", name: "Rickshaw fare", sub: "Transport", amount: "৳80", baki: false },
      ]
    : [
        { key: "1", icon: "utensils", color: "#f97316", name: "দুপুরের খাবার ও চা", sub: "খাবার ও নাশতা", amount: "৳১২৫", baki: false },
        { key: "2", icon: "shopping-basket", color: "#16a34a", name: "মুদি বাজার (বাকি)", sub: "পাড়ার দোকান", amount: "৳৫৫০", baki: true },
        { key: "3", icon: "bus", color: "#0ea5e9", name: "রিকশা ভাড়া", sub: "যাতায়াত", amount: "৳৮০", baki: false },
      ];

  const controlIcons = [ShieldCheck, Lock, Download, Trash2];

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      {/* Background ambient lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]">
        <div className="absolute -left-28 -top-28 size-[26rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-28 top-28 size-[24rem] rounded-full bg-[#8b5cf6]/15 blur-3xl" />
      </div>

      <PublicHeader locale={locale} signedIn={!!user} languageHrefs={{ bn: whyPath("bn"), en: whyPath("en") }} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              inLanguage: locale === "en" ? "en" : "bn-BD",
              url: `${SITE_URL}${whyPath(locale)}`,
              mainEntity: WHY.faq.items.map((f) => ({
                "@type": "Question",
                name: t(f.q),
                acceptedAnswer: { "@type": "Answer", text: t(f.a) },
              })),
            }).replace(/</g, "\\u003c"),
          }}
        />

        {/* 1. HERO SECTION */}
        <section className="pt-8 pb-14 text-center sm:pt-14 sm:pb-20">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft/80 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
            <Sparkles className="size-3.5" aria-hidden />
            <span>{t(WHY.hero.badge)}</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl text-balance">
            {t(WHY.hero.title)}
          </h1>
          <p className="mt-2 text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl bg-linear-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
            {t(WHY.hero.punchline)}
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
            {t(WHY.hero.body)}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={user ? "/dashboard" : "/register"}
              className={buttonClass("primary", "md", "h-13 w-full sm:w-auto px-8 text-base shadow-lg shadow-primary/25 gap-2 font-semibold")}
            >
              <span>{user ? t(WHY.cta.open) : t(WHY.cta.button)}</span>
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <p className="mt-3.5 text-xs font-medium text-ink-3">
            {t(WHY.hero.trust)}
          </p>

          {/* Mobile-first Realistic App Preview Widget */}
          <div aria-hidden className="mx-auto mt-10 w-full max-w-sm select-none">
            <div className="rounded-[2.25rem] border border-line/80 bg-surface p-3 shadow-float">
              <div className="rounded-[1.75rem] bg-page p-3 sm:p-3.5">
                {/* Header card with daily total */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-from to-brand-to p-4 text-white shadow-sm">
                  <span className="absolute -right-6 -top-6 size-24 rounded-full bg-white/10 blur-xl" />
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span className="font-medium">{locale === "en" ? "Today's spending" : "আজকের মোট খরচ"}</span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold backdrop-blur-xs">
                      {locale === "en" ? "3-day streak 🔥" : "৩ দিনের স্ট্রিক 🔥"}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight tabular">{locale === "en" ? "৳ 755" : "৳ ৭৫৫"}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-white/90">
                    <span>{locale === "en" ? "Food budget used" : "খাবারের বাজেট ব্যবহৃত"}</span>
                    <span className="font-semibold tabular">75%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-white/25">
                    <div className="h-full w-3/4 rounded-full bg-white" />
                  </div>
                </div>

                {/* Today's logged expenses */}
                <div className="mt-3 rounded-2xl border border-line/60 bg-surface p-3 text-left">
                  <div className="mb-2.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink">{locale === "en" ? "Today's entries" : "আজকের হিসাব"}</span>
                    <span className="text-[11px] font-medium text-ink-3">{locale === "en" ? "3 items" : "৩টি এন্ট্রি"}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {previewItems.map((item) => (
                      <li key={item.key} className="flex items-center justify-between rounded-xl bg-page/70 p-2 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CategoryIcon icon={item.icon} color={item.color} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink">{item.name}</p>
                            <p className="text-[10px] text-ink-3">{item.sub}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <span className="font-bold text-ink tabular">{item.amount}</span>
                          {item.baki && (
                            <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                              {locale === "en" ? "Baki" : "বাকি"}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2.5 flex items-center justify-center gap-1 text-[11px] font-medium text-good">
                    <CheckCircle2 className="size-3.5" />
                    <span>{locale === "en" ? "Logged in 10 seconds" : "১০ সেকেন্ডে হিসাব সংরক্ষিত"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PROBLEMS SECTION */}
        <section aria-labelledby="problems" className="py-12 border-t border-line/50">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t(WHY.problems.badge)}
            </span>
            <h2 id="problems" className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t(WHY.problems.title)}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-ink-2">
              {t(WHY.problems.subtitle)}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {WHY.problems.items.map((p) => (
              <div
                key={p.tag.en}
                className="flex flex-col rounded-3xl border border-line/70 bg-surface p-5 shadow-card transition-all hover:border-primary/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {t(p.tag)}
                  </span>
                  <span className="font-serif text-3xl leading-none text-primary/40" aria-hidden>
                    “
                  </span>
                </div>
                <p className="font-semibold text-ink text-sm sm:text-base leading-snug">
                  {t(p.quote)}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-ink-2 leading-relaxed">
                  {t(p.body)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SCIENTIFIC RESEARCH / HIGHLIGHTS */}
        <section aria-labelledby="research" className="py-12 border-t border-line/50">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t(WHY.research.badge)}
            </span>
            <h2 id="research" className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t(WHY.research.title)}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-ink-2">
              {t(WHY.research.body)}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map((h) => (
              <Link
                key={h.stat.en}
                href={blogPath(locale, h.slug)}
                className="group flex h-full flex-col justify-between rounded-3xl border border-line/70 bg-surface p-6 shadow-card transition-all hover:border-primary/50 hover:bg-muted/40 hover:shadow-md"
              >
                <div>
                  <span className="text-4xl font-extrabold tracking-tight text-primary">
                    {locale === "en" ? h.stat.en : h.stat.bn}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">
                    {locale === "en" ? h.en : h.bn}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-end border-t border-line/50 pt-3 text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:underline">
                    {locale === "en" ? "Read research article" : "গবেষণাটি পড়ুন"}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. MID-PAGE REGISTRATION HOOK */}
        {!user && (
          <section className="my-6 rounded-3xl border border-primary/20 bg-primary-soft/50 p-6 sm:p-8 text-center shadow-xs">
            <h3 className="text-lg sm:text-xl font-bold text-ink">
              {t(WHY.midCta.title)}
            </h3>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-2">
              {t(WHY.midCta.body)}
            </p>
            <div className="mt-4 flex justify-center">
              <Link href="/register" className={buttonClass("primary", "md", "h-11 px-7 text-sm font-semibold gap-1.5 shadow-sm shadow-primary/25")}>
                <span>{t(WHY.midCta.button)}</span>
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </section>
        )}

        {/* 5. BENEFITS SECTION */}
        <section aria-labelledby="benefits" className="py-12 border-t border-line/50">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t(WHY.benefits.badge)}
            </span>
            <h2 id="benefits" className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t(WHY.benefits.title)}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-ink-2">
              {t(WHY.benefits.subtitle)}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.benefits.items.map((b) => {
              const Icon = ICONS[b.icon as keyof typeof ICONS];
              return (
                <div
                  key={b.icon}
                  className="rounded-3xl border border-line/70 bg-surface p-5 shadow-card transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="size-5.5" aria-hidden />
                  </span>
                  <h3 className="mt-3.5 font-bold text-ink text-base">
                    {t(b.title)}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-ink-2">
                    {t(b.body)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. COMPARISON TABLE */}
        <section aria-labelledby="compare" className="py-12 border-t border-line/50">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t(WHY.compare.badge)}
            </span>
            <h2 id="compare" className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t(WHY.compare.title)}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-ink-2">
              {t(WHY.compare.subtitle)}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl overflow-x-auto rounded-3xl border border-line/70 bg-surface shadow-card">
            <table className="w-full min-w-[340px] table-fixed text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-3">
                  <th className="w-[42%] px-3 sm:px-4 py-3.5 text-left font-medium sm:w-1/2" />
                  <th className="px-1 py-3.5 font-medium">{t(WHY.compare.columns.notebook)}</th>
                  <th className="px-1 py-3.5 font-medium">{t(WHY.compare.columns.sheet)}</th>
                  <th className="relative bg-primary-soft/70 px-1 py-3.5 font-bold text-primary">
                    <span className="inline-block rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white mb-1">
                      {locale === "en" ? "Best" : "সেরা"}
                    </span>
                    <span className="block">{t(WHY.compare.columns.hisab)}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {WHY.compare.rows.map((r) => (
                  <tr key={r.label.en}>
                    <th scope="row" className="px-3 sm:px-4 py-3 text-left font-normal text-ink">
                      {t(r.label)}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className={`px-1 py-3 text-center ${i === 2 ? "bg-primary-soft/70" : ""}`}>
                        <Cell value={v} locale={locale} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. PRIVACY & PEACE OF MIND */}
        <section aria-labelledby="control" className="py-12 border-t border-line/50">
          <div className="mx-auto max-w-3xl rounded-3xl border border-line/70 bg-surface p-6 shadow-card sm:p-8">
            <div className="text-center sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-good">
                {t(WHY.control.badge)}
              </span>
              <h2 id="control" className="mt-1 flex items-center justify-center sm:justify-start gap-2 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                <ShieldCheck className="size-6 text-good shrink-0" aria-hidden />
                <span>{t(WHY.control.title)}</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-ink-2">
                {t(WHY.control.subtitle)}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {WHY.control.items.map((c, idx) => {
                const Icon = controlIcons[idx] ?? Check;
                return (
                  <div key={c.en} className="flex items-start gap-3 rounded-2xl bg-page/60 p-3.5 text-xs sm:text-sm text-ink-2">
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-good/15 text-good">
                      <Icon className="size-3.5" aria-hidden />
                    </div>
                    <span className="leading-relaxed">{t(c)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. FAQ ACCORDION */}
        <section aria-labelledby="faq" className="py-12 border-t border-line/50">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t(WHY.faq.badge)}
            </span>
            <h2 id="faq" className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {t(WHY.faq.title)}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base text-ink-2">
              {t(WHY.faq.subtitle)}
            </p>
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3">
            {WHY.faq.items.map((f) => (
              <details
                key={f.q.en}
                className="group rounded-2xl border border-line/70 bg-surface px-5 py-4 shadow-xs transition-all hover:border-primary/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink text-sm sm:text-base [&::-webkit-details-marker]:hidden">
                  <span>{t(f.q)}</span>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-ink-3 transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-2 border-t border-line/40 pt-3">
                  {t(f.a)}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 9. FINAL HIGH-CONVERTING CTA BANNER */}
        <section className="my-14 rounded-3xl bg-linear-to-br from-brand-from to-brand-to px-6 py-12 text-center text-white shadow-float sm:py-16">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            {locale === "en" ? "Get started in 60 seconds" : "শুরু করুন মাত্র ৬০ সেকেন্ডে"}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
            {t(WHY.cta.title)}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-white/90 leading-relaxed">
            {t(WHY.cta.body)}
          </p>

          <div className="mt-7 flex justify-center">
            <Link
              href={user ? "/dashboard" : "/register"}
              className={buttonClass("secondary", "md", "h-13 px-8 text-base font-bold shadow-lg shadow-black/15 gap-2 border-transparent")}
            >
              <span>{user ? t(WHY.cta.open) : t(WHY.cta.button)}</span>
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <p className="mt-4 text-xs font-medium text-white/80">
            {t(WHY.cta.trust)}
          </p>

          <div className="mt-6 border-t border-white/20 pt-5">
            <Link href={blogPath(locale)} className="text-xs sm:text-sm text-white/90 underline underline-offset-4 hover:text-white">
              {t(WHY.cta.articles)}
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter locale={locale} />
    </div>
  );
}
