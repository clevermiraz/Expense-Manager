import { ArrowLeft, ArrowRight, ChevronRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArticleBody, ArticleIcon } from "@/components/learn";
import { PublicFooter, PublicHeader } from "@/components/public-shell";
import { buttonClass } from "@/components/ui/button";
import { ARTICLES, blogPath, getArticle, localized, type Article } from "@/content/learn";
import { formatDay, formatNumber } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import { SITE_URL } from "@/lib/site";

// "Why keep track" articles first, then the practical how-tos.
const WHY = ["write-it-down", "pain-of-paying", "baki", "habit"];

const ogLocale = (locale: string) => (locale === "en" ? "en_US" : "bn_BD");
const languages = (slug?: string) => ({ bn: blogPath("bn", slug), en: blogPath("en", slug), "x-default": blogPath("bn", slug) });

/** JSON-LD in a <script>; "<" escaped so text can't close the tag. */
function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}

export async function blogIndexMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: blogPath(locale), languages: languages() },
    openGraph: {
      type: "website",
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: blogPath(locale),
      locale: ogLocale(locale),
    },
  };
}

export async function blogArticleMetadata(locale: string, slug: string): Promise<Metadata> {
  const article = getArticle(slug);
  if (!article) return {};
  const text = localized(article, locale);
  return {
    title: text.title,
    description: text.summary,
    alternates: { canonical: blogPath(locale, slug), languages: languages(slug) },
    openGraph: {
      type: "article",
      title: text.title,
      description: text.summary,
      url: blogPath(locale, slug),
      locale: ogLocale(locale),
      publishedTime: article.published,
      modifiedTime: article.updated ?? article.published,
    },
    twitter: { card: "summary", title: text.title, description: text.summary },
  };
}

function ArticleCard({ article, locale, minutesLabel }: { article: Article; locale: string; minutesLabel: string }) {
  const text = localized(article, locale);
  return (
    <li>
      <Link
        href={blogPath(locale, article.slug)}
        className="flex h-full items-start gap-4 rounded-3xl border border-line/70 bg-surface p-4 shadow-card transition-colors hover:bg-muted/40 sm:p-5"
      >
        <ArticleIcon icon={article.icon} />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug text-ink">{text.title}</span>
          <span className="mt-1 block text-sm text-ink-3">{text.summary}</span>
          <span className="mt-2 block text-xs font-medium text-primary">{minutesLabel}</span>
        </span>
        <ChevronRight className="mt-1 size-4 shrink-0 text-ink-3" aria-hidden />
      </Link>
    </li>
  );
}

/** Signed-out readers are invited to sign up; signed-in ones jump into the add sheet. */
async function CallToAction({ signedIn }: { signedIn: boolean }) {
  const t = await getTranslations("blog");
  return (
    <section className="rounded-3xl bg-linear-to-br from-brand-from to-brand-to p-5 text-white shadow-card sm:p-6">
      <h2 className="text-lg font-semibold">{signedIn ? t("ctaUserTitle") : t("ctaGuestTitle")}</h2>
      <p className="mt-1 text-sm text-white/85">{signedIn ? t("ctaUserBody") : t("ctaGuestBody")}</p>
      <Link
        href={signedIn ? "/dashboard?add=1" : "/register"}
        className={buttonClass("secondary", "md", "mt-4 border-transparent")}
      >
        {signedIn ? t("ctaUser") : t("ctaGuest")}
      </Link>
    </section>
  );
}

export async function BlogIndex({ locale }: { locale: string }) {
  const [t, user] = await Promise.all([getTranslations("blog"), getCurrentUser()]);
  const minutes = (a: Article) => t("minutes", { n: formatNumber(a.minutes, locale) });
  const why = ARTICLES.filter((a) => WHY.includes(a.slug));
  const how = ARTICLES.filter((a) => !WHY.includes(a.slug));
  const appName = locale === "en" ? "Hisab" : "হিসাব";

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader locale={locale} signedIn={!!user} languageHrefs={languages()} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Blog",
            name: t("title"),
            description: t("metaDescription"),
            url: `${SITE_URL}${blogPath(locale)}`,
            inLanguage: locale === "en" ? "en" : "bn-BD",
            publisher: { "@type": "Organization", name: appName, url: SITE_URL },
            blogPost: ARTICLES.map((a) => ({
              "@type": "BlogPosting",
              headline: localized(a, locale).title,
              url: `${SITE_URL}${blogPath(locale, a.slug)}`,
              datePublished: a.published,
            })),
          }}
        />
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t("title")}</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-2 sm:text-lg">{t("subtitle")}</p>

        <h2 className="mb-3 mt-10 text-lg font-semibold text-ink">{t("whyHeading")}</h2>
        <ul className="grid gap-3 lg:grid-cols-2">
          {why.map((a) => (
            <ArticleCard key={a.slug} article={a} locale={locale} minutesLabel={minutes(a)} />
          ))}
        </ul>

        <h2 className="mb-3 mt-10 text-lg font-semibold text-ink">{t("howHeading")}</h2>
        <ul className="grid gap-3 lg:grid-cols-2">
          {how.map((a) => (
            <ArticleCard key={a.slug} article={a} locale={locale} minutesLabel={minutes(a)} />
          ))}
        </ul>

        <div className="mt-10">
          <CallToAction signedIn={!!user} />
        </div>
      </main>
      <PublicFooter locale={locale} />
    </div>
  );
}

export async function BlogArticle({ locale, slug }: { locale: string; slug: string }) {
  const article = getArticle(slug);
  if (!article) notFound();
  const [t, user] = await Promise.all([getTranslations("blog"), getCurrentUser()]);
  const text = localized(article, locale);
  const next = ARTICLES[(ARTICLES.indexOf(article) + 1) % ARTICLES.length];
  const appName = locale === "en" ? "Hisab" : "হিসাব";
  const date = formatDay(article.published, locale, { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader locale={locale} signedIn={!!user} languageHrefs={languages(slug)} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: text.title,
            description: text.summary,
            inLanguage: locale === "en" ? "en" : "bn-BD",
            datePublished: article.published,
            dateModified: article.updated ?? article.published,
            mainEntityOfPage: `${SITE_URL}${blogPath(locale, slug)}`,
            author: { "@type": "Organization", name: t("author"), url: SITE_URL },
            publisher: {
              "@type": "Organization",
              name: appName,
              logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/icon-512.png` },
            },
            image: `${SITE_URL}/icons/icon-512.png`,
            citation: article.sources.map((s) => s.url),
          }}
        />
        <article>
          <Link
            href={blogPath(locale)}
            className="-ml-1 inline-flex items-center gap-1.5 rounded-lg p-1 text-sm font-medium text-ink-3 hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("back")}
          </Link>

          <header className="mb-6 mt-4">
            <ArticleIcon icon={article.icon} size="lg" />
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-4xl sm:leading-tight">
              {text.title}
            </h1>
            <p className="mt-3 text-sm text-ink-3">
              {t("author")} · <time dateTime={article.published}>{date}</time> ·{" "}
              {t("minutes", { n: formatNumber(article.minutes, locale) })}
            </p>
          </header>

          <ArticleBody blocks={text.body} />

          <div className="mt-10">
            <CallToAction signedIn={!!user} />
          </div>

          {article.sources.length > 0 && (
            <section className="mt-10 border-t border-line pt-6">
              <h2 className="text-sm font-semibold text-ink">{t("sources")}</h2>
              <p className="mt-1 text-xs text-ink-3">{t("sourcesHint")}</p>
              <ol className="mt-3 flex flex-col gap-2 text-sm">
                {article.sources.map((s, i) => (
                  <li key={s.url} className="flex gap-2">
                    <span className="text-ink-3 tabular">{formatNumber(i + 1, locale)}.</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 items-start gap-1 break-words text-primary hover:underline"
                    >
                      <span className="min-w-0">{s.label}</span>
                      <ExternalLink className="mt-1 size-3 shrink-0" aria-hidden />
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>

        <Link
          href={blogPath(locale, next.slug)}
          className="mt-10 flex items-center gap-4 rounded-3xl border border-line/70 bg-surface p-4 shadow-card hover:bg-muted/40"
        >
          <ArticleIcon icon={next.icon} />
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-ink-3">{t("next")}</span>
            <span className="block font-semibold leading-snug text-ink">{localized(next, locale).title}</span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-ink-3" aria-hidden />
        </Link>
      </main>
      <PublicFooter locale={locale} />
    </div>
  );
}
