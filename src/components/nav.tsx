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
        className="mb-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-strong cursor-pointer"
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
      className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
        isActive(href) ? "text-primary" : "text-ink-3"
      }`}
    >
      <Icon className="size-5" aria-hidden />
      {t(key)}
    </Link>
  );
  return (
    <nav
      aria-label={t("main")}
      className="fixed inset-x-0 bottom-0 z-30 flex items-center border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {left.map(link)}
      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={() => openExpense()}
          aria-label={t("addExpense")}
          className="-mt-6 inline-flex size-13 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-4 ring-page cursor-pointer"
        >
          <Plus className="size-6" aria-hidden />
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
