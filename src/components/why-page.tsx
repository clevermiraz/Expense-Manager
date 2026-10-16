import { ArrowRight, BellRing, ChartColumn, Check, HandCoins, Minus, ShieldCheck, Smartphone, Target, X, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { buttonClass } from "@/components/ui/button";
import { blogPath, HIGHLIGHTS, whyPath } from "@/content/learn";
import { pick, WHY } from "@/content/why";
import { getCurrentUser } from "@/lib/session";
import { OG_IMAGE, SITE_URL } from "@/lib/site";

const ICONS = { zap: Zap, chart: ChartColumn, target: Target, handcoins: HandCoins, bell: BellRing, phone: Smartphone } as const;
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
      url: whyPath(locale),
      locale: locale === "en" ? "en_US" : "bn_BD",
      images: [OG_IMAGE],
    },
  };
}

function Cell({ value, locale }: { value: "yes" | "partly" | "no" | "free"; locale: string }) {
  const label = pick(WHY.compare.legend[value], locale);
  if (value === "yes") return <Check className="mx-auto size-5 text-good" strokeWidth={3} aria-label={label} />;
  if (value === "no") return <X className="mx-auto size-5 text-ink-3" aria-label={label} />;
  if (value === "free") return <span className="text-xs font-medium text-ink-2">{label}</span>;
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
  const cta = user ? (
    <Link href="/dashboard" className={buttonClass("primary", "md", "h-12 px-7 text-base")}>
      {t(WHY.cta.open)}
    </Link>
  ) : (
    <Link href="/register" className={buttonClass("primary", "md", "h-12 px-7 text-base")}>
      {t(WHY.cta.button)}
    </Link>
  );

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-24 top-24 size-80 rounded-full bg-[#8b5cf6]/15 blur-3xl" />
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

        <section className="py-12 text-center sm:py-16">
          <h1 className="text-4xl font-bold tracking-tight text-balance text-ink sm:text-5xl">{t(WHY.hero.title)}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-2">{t(WHY.hero.body)}</p>
          <div className="mt-8 flex justify-center">{cta}</div>
        </section>

        <section aria-labelledby="problems" className="pb-14">
          <h2 id="problems" className="text-center text-2xl font-bold tracking-tight text-ink">
            {t(WHY.problems.title)}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {WHY.problems.items.map((p) => (
              <li key={p.en} className="rounded-3xl border border-line/70 bg-surface p-5 text-ink-2 shadow-card">
                <span className="block font-serif text-4xl leading-none text-primary/60" aria-hidden>
                  “
                </span>
                {t(p)}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="research" className="pb-14">
          <h2 id="research" className="text-center text-2xl font-bold tracking-tight text-ink">
            {t(WHY.research.title)}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-ink-2">{t(WHY.research.body)}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {HIGHLIGHTS.map((h) => (
              <li key={h.stat.en}>
                <Link
                  href={blogPath(locale, h.slug)}
                  className="group flex h-full flex-col rounded-3xl border border-line/70 bg-surface p-5 shadow-card transition-colors hover:bg-muted/40"
                >
                  <span className="text-4xl font-bold tracking-tight text-primary">{locale === "en" ? h.stat.en : h.stat.bn}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{locale === "en" ? h.en : h.bn}</span>
                  <ArrowRight className="mt-3 size-4 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="benefits" className="pb-14">
          <h2 id="benefits" className="text-center text-2xl font-bold tracking-tight text-ink">
            {t(WHY.benefits.title)}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.benefits.items.map((b) => {
              const Icon = ICONS[b.icon as keyof typeof ICONS];
              return (
                <li key={b.icon} className="rounded-3xl border border-line/70 bg-surface p-5 shadow-card">
                  <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-semibold text-ink">{t(b.title)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{t(b.body)}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="compare" className="pb-14">
          <h2 id="compare" className="text-center text-2xl font-bold tracking-tight text-ink">
            {t(WHY.compare.title)}
          </h2>
          <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-3xl border border-line/70 bg-surface shadow-card">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-ink-3">
                  <th className="w-[46%] px-4 py-3 text-left font-medium sm:w-1/2" />
                  <th className="px-1 py-3 font-medium">{t(WHY.compare.columns.notebook)}</th>
                  <th className="px-1 py-3 font-medium">{t(WHY.compare.columns.sheet)}</th>
                  <th className="bg-primary-soft/60 px-1 py-3 font-semibold text-primary">{t(WHY.compare.columns.hisab)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {WHY.compare.rows.map((r) => (
                  <tr key={r.label.en}>
                    <th scope="row" className="px-4 py-3 text-left font-normal text-ink">
                      {t(r.label)}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className={`px-1 py-3 text-center ${i === 2 ? "bg-primary-soft/60" : ""}`}>
                        <Cell value={v} locale={locale} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="control" className="pb-14">
          <div className="mx-auto max-w-3xl rounded-3xl border border-line/70 bg-surface p-5 shadow-card sm:p-6">
            <h2 id="control" className="flex items-center gap-2 text-xl font-bold tracking-tight text-ink">
              <ShieldCheck className="size-6 text-good" aria-hidden />
              {t(WHY.control.title)}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {WHY.control.items.map((c) => (
                <li key={c.en} className="flex items-start gap-3 text-ink-2">
                  <Check className="mt-1 size-4 shrink-0 text-good" strokeWidth={3} aria-hidden />
                  {t(c)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="faq" className="pb-14">
          <h2 id="faq" className="text-center text-2xl font-bold tracking-tight text-ink">
            {t(WHY.faq.title)}
          </h2>
          <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-2">
            {WHY.faq.items.map((f) => (
              <details key={f.q.en} className="group rounded-2xl border border-line/70 bg-surface px-5 py-4 shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {t(f.q)}
                  <span className="text-xl leading-none text-ink-3 transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{t(f.a)}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-3xl bg-linear-to-br from-brand-from to-brand-to px-5 py-10 text-center text-white shadow-card">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(WHY.cta.title)}</h2>
          <p className="mx-auto mt-2 max-w-md text-white/85">{t(WHY.cta.body)}</p>
          <Link
            href={user ? "/dashboard" : "/register"}
            className={buttonClass("secondary", "md", "mt-6 h-12 border-transparent px-7 text-base")}
          >
            {user ? t(WHY.cta.open) : t(WHY.cta.button)}
          </Link>
          <p className="mt-5 text-sm">
            <Link href={blogPath(locale)} className="text-white/90 underline underline-offset-4 hover:text-white">
              {t(WHY.cta.articles)}
            </Link>
          </p>
        </section>
      </main>

      <PublicFooter locale={locale} />
    </div>
  );
}
