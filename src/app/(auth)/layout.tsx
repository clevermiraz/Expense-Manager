import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const t = await getTranslations("common");
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96">
        <div className="absolute -left-24 -top-24 size-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 top-10 size-72 rounded-full bg-[#8b5cf6]/10 blur-3xl" />
      </div>
      <header className="flex items-center justify-between px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8">
        <Link href="/">
          <Logo name={t("appName")} />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:pt-0">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
