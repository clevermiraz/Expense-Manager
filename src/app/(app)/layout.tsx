import { Settings } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppProvider } from "@/components/app-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { BottomNav, SidebarNav, SignOutButton } from "@/components/nav";
import { InstallButton } from "@/components/pwa/install";
import { ThemeSwitcher, ThemeToggle } from "@/components/theme";
import { getCategories } from "@/lib/data";
import { requireUser, userToday } from "@/lib/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const [categories, t, tn] = await Promise.all([
    getCategories(user.id),
    getTranslations("common"),
    getTranslations("nav"),
  ]);

  return (
    <AppProvider data={{ categories, currency: user.currency, today: userToday(user) }}>
      <div className="min-h-dvh md:flex">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-surface px-4 py-5 md:flex">
          <Link href="/dashboard" className="mb-6 px-2">
            <Logo name={t("appName")} />
          </Link>
          <SidebarNav />
          <div className="mt-auto flex flex-col gap-3 border-t border-line pt-4">
            <InstallButton />
            <LanguageSwitcher />
            <ThemeSwitcher showLabels={false} />
            <div className="px-1">
              <p className="truncate text-sm font-medium text-ink" data-testid="user-name">{user.name}</p>
              <p className="truncate text-xs text-ink-3">{user.email}</p>
            </div>
            <SignOutButton className="-ml-1 justify-start" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line/60 bg-page/80 px-4 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] backdrop-blur-xl md:hidden">
            <Link href="/dashboard">
              <Logo name={t("appName")} />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher compact />
              <ThemeToggle />
              <Link
                href="/settings"
                aria-label={tn("settings")}
                className="inline-flex size-9 items-center justify-center rounded-xl border border-line bg-surface text-ink-2 hover:text-ink"
              >
                <Settings className="size-4.5" aria-hidden />
              </Link>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-[calc(env(safe-area-inset-bottom)+7rem)] pt-4 sm:px-6 md:pb-10 md:pt-8">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </AppProvider>
  );
}
