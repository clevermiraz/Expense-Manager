import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AppProvider } from "@/components/app-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { AccountMenu, BottomNav, SidebarNav, SignOutButton } from "@/components/nav";
import { InstallButton } from "@/components/pwa/install";
import { ThemeSwitcher, ThemeToggle } from "@/components/theme";
import { getCategories, getNoteSuggestions } from "@/lib/data";
import { requireUser, userToday } from "@/lib/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const [categories, noteSuggestions, t] = await Promise.all([
    getCategories(user.id),
    getNoteSuggestions(user.id),
    getTranslations("common"),
  ]);

  return (
    <AppProvider data={{ categories, noteSuggestions, currency: user.currency, today: userToday(user) }}>
      <div className="min-h-dvh [--app-header-h:calc(env(safe-area-inset-top)+3.5rem)] md:flex">
        {/* Scrolls on its own when taller than the screen (e.g. a phone in landscape). */}
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-line bg-surface px-4 py-5 md:flex">
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
          {/* Fixed height (notch + 3.5rem) so sticky elements below can sit under it via --app-header-h. */}
          <header className="sticky top-0 z-20 flex h-(--app-header-h) items-center justify-between border-b border-line/60 bg-page/80 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl md:hidden">
            <Link href="/dashboard">
              <Logo name={t("appName")} />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher compact />
              <ThemeToggle />
              <AccountMenu name={user.name} email={user.email} />
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
