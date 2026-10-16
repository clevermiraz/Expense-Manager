"use client";

import { BookOpen, ChartColumn, ChevronRight, LayoutDashboard, ListOrdered, LogOut, Plus, Settings, Target } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useApp } from "@/components/app-context";
import { Dialog, DialogBody } from "@/components/ui/dialog";
import { whyPath } from "@/content/learn";
import { authClient } from "@/lib/auth-client";

const ITEMS = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/expenses", key: "expenses", icon: ListOrdered },
  { href: "/insights", key: "insights", icon: ChartColumn },
  { href: "/budgets", key: "budgets", icon: Target },
  { href: "/settings", key: "settings", icon: Settings },
] as const;

/**
 * Which tab is highlighted. A tapped tab lights up right away, before its page
 * has loaded, so the app answers the tap instantly.
 */
function useActive() {
  const pathname = usePathname();
  const [tapped, setTapped] = useState<{ href: string; from: string } | null>(null);
  // Forget the tap once we've arrived (or moved on some other way).
  const current = tapped && tapped.from === pathname ? tapped.href : null;
  const isActive = (href: string) =>
    current ? current === href : pathname === href || pathname.startsWith(`${href}/`);
  const onTap = (href: string) => setTapped({ href, from: pathname });
  return { isActive, onTap };
}

export function SidebarNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { isActive, onTap } = useActive();
  const { openExpense } = useApp();
  return (
    <nav aria-label={t("main")} className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => openExpense()}
        className="mb-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-linear-to-br from-brand-from to-brand-to px-4 text-sm font-medium text-white shadow-sm shadow-primary/25 hover:opacity-95 cursor-pointer"
      >
        <Plus className="size-4" aria-hidden />
        {t("addExpense")}
      </button>
      {ITEMS.map(({ href, key, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => onTap(href)}
          aria-current={isActive(href) ? "page" : undefined}
          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            isActive(href) ? "bg-primary-soft text-primary" : "text-ink-2 hover:bg-muted hover:text-ink"
          }`}
        >
          <Icon className="size-4.5" aria-hidden />
          {t(key)}
        </Link>
      ))}
      {/* Why use Hisab (and from there, the tips and articles). */}
      <Link
        href={whyPath(locale)}
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-muted hover:text-ink"
      >
        <BookOpen className="size-4.5" aria-hidden />
        {t("learn")}
      </Link>
    </nav>
  );
}

export function BottomNav() {
  const t = useTranslations("nav");
  const { isActive, onTap } = useActive();
  const { openExpense } = useApp();
  const left = ITEMS.slice(0, 2);
  const right = ITEMS.slice(2, 4);
  const link = ({ href, key, icon: Icon }: (typeof ITEMS)[number]) => (
    <Link
      key={href}
      href={href}
      onClick={() => onTap(href)}
      aria-current={isActive(href) ? "page" : undefined}
      className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium transition-colors ${
        isActive(href) ? "text-primary" : "text-ink-3"
      }`}
    >
      <span
        className={`inline-flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
          isActive(href) ? "bg-primary-soft" : ""
        }`}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="max-w-full truncate">{t(key)}</span>
    </Link>
  );
  return (
    <nav
      aria-label={t("main")}
      className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.5rem)] z-30 flex items-center rounded-[1.75rem] border border-line/70 bg-surface/85 p-1.5 shadow-float backdrop-blur-xl md:hidden"
    >
      {left.map(link)}
      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={() => openExpense()}
          aria-label={t("addExpense")}
          className="inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-from to-brand-to text-white shadow-lg shadow-primary/30 transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="size-6" strokeWidth={2.5} aria-hidden />
        </button>
      </div>
      {right.map(link)}
    </nav>
  );
}

export function SignOutButton({ className = "", danger = false }: { className?: string; danger?: boolean }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        router.push("/login");
        router.refresh();
      }}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium disabled:opacity-60 cursor-pointer ${
        danger ? "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15" : "text-ink-2 hover:bg-muted hover:text-ink"
      } ${className}`}
    >
      <LogOut className="size-4" aria-hidden />
      {t("signOut")}
    </button>
  );
}

/** Phone header: avatar that opens a sheet with the account, Settings and a clear Sign out. */
export function AccountMenu({ name, email }: { name: string; email: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  // Close the sheet after navigating (e.g. tapping Settings).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openAccount")}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-from to-brand-to text-sm font-semibold text-white shadow-sm shadow-primary/30 cursor-pointer"
      >
        {initial}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t("account")} closeLabel={tc("close")}>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-muted p-3">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-from to-brand-to text-lg font-semibold text-white">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{name}</p>
                <p className="truncate text-sm text-ink-3">{email}</p>
              </div>
            </div>
            {[
              { href: "/settings", label: t("settings"), Icon: Settings },
              { href: whyPath(locale), label: t("learn"), Icon: BookOpen },
            ].map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3 text-sm font-medium text-ink hover:bg-muted"
              >
                <Icon className="size-4.5 text-ink-2" aria-hidden />
                <span className="flex-1">{label}</span>
                <ChevronRight className="size-4 text-ink-3" aria-hidden />
              </Link>
            ))}
            <SignOutButton danger className="h-12 w-full justify-center rounded-2xl" />
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
