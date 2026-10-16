"use client";

import { ChartColumn, LayoutDashboard, ListOrdered, LogOut, Plus, Settings, Target } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useApp } from "@/components/app-context";
import { authClient } from "@/lib/auth-client";

const ITEMS = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/expenses", key: "expenses", icon: ListOrdered },
  { href: "/insights", key: "insights", icon: ChartColumn },
  { href: "/budgets", key: "budgets", icon: Target },
  { href: "/settings", key: "settings", icon: Settings },
] as const;

function useActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const t = useTranslations("nav");
  const isActive = useActive();
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
          aria-current={isActive(href) ? "page" : undefined}
          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            isActive(href) ? "bg-primary-soft text-primary" : "text-ink-2 hover:bg-muted hover:text-ink"
          }`}
        >
          <Icon className="size-4.5" aria-hidden />
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}

export function BottomNav() {
  const t = useTranslations("nav");
  const isActive = useActive();
  const { openExpense } = useApp();
  const left = ITEMS.slice(0, 2);
  const right = ITEMS.slice(2, 4);
  const link = ({ href, key, icon: Icon }: (typeof ITEMS)[number]) => (
    <Link
      key={href}
      href={href}
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

export function SignOutButton({ className = "" }: { className?: string }) {
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
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-2 hover:bg-muted hover:text-ink disabled:opacity-60 cursor-pointer ${className}`}
    >
      <LogOut className="size-4" aria-hidden />
      {t("signOut")}
    </button>
  );
}
