import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { LanguageLinks } from "@/components/blog/language-links";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme";
import { buttonClass } from "@/components/ui/button";
import { blogPath, whyPath } from "@/content/learn";

/**
 * Header for the public pages (landing, blog). `languageHrefs` is set on pages
 * whose URL fixes the language, so the switch moves to the other URL.
 */
export async function PublicHeader({
  locale,
  signedIn,
  languageHrefs,
}: {
  locale: string;
  signedIn: boolean;
  languageHrefs?: Record<string, string>;
}) {
  const [t, tc] = await Promise.all([getTranslations("blog"), getTranslations("common")]);
  return (
    <header className="sticky top-0 z-20 border-b border-line/50 bg-page/75 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo name={tc("appName")} />
        </Link>
        <nav aria-label={t("nav")} className="flex items-center gap-1.5 sm:gap-2">
          {/* On these pages phones skip this link to make room for the rest. */}
          <Link
            href={whyPath(locale)}
            className={buttonClass("ghost", "sm", `whitespace-nowrap px-2.5 ${languageHrefs ? "max-sm:hidden" : ""}`)}
          >
            {t("whyNav")}
          </Link>
          {languageHrefs ? <LanguageLinks hrefs={languageHrefs} /> : <LanguageSwitcher compact />}
          <ThemeToggle />
          <Link
            href={signedIn ? "/dashboard" : "/login"}
            className={buttonClass(signedIn ? "primary" : "ghost", "sm", "whitespace-nowrap px-2.5 max-[359px]:hidden")}
          >
            {signedIn ? t("openApp") : t("login")}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export async function PublicFooter({ locale, children }: { locale: string; children?: ReactNode }) {
  const [t, tc] = await Promise.all([getTranslations("blog"), getTranslations("common")]);
  return (
    <footer className="border-t border-line px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-sm text-ink-3">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
        {children}
        <nav aria-label={t("footerNav")} className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link href={whyPath(locale)} className="hover:text-ink">
            {t("whyNav")}
          </Link>
          <Link href={blogPath(locale)} className="hover:text-ink">
            {t("nav")}
          </Link>
          <Link href="/register" className="hover:text-ink">
            {t("register")}
          </Link>
          <Link href="/login" className="hover:text-ink">
            {t("login")}
          </Link>
        </nav>
        <p className="text-xs">
          {tc("appName")} · {tc("tagline")}
        </p>
      </div>
    </footer>
  );
}
