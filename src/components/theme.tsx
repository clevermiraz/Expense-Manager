"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import { THEME_COLOR, THEME_COOKIE, type Theme } from "@/lib/theme";

type ThemeContextValue = { theme: Theme; setTheme: (t: Theme) => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

/** Applies a theme to the live page (the server renders it from the cookie on the next load). */
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  // Keep the browser / installed-app title bar in step with the page. These
  // <meta> tags are rendered by Next.js (generateViewport), so they're only
  // updated in place: removing them makes React crash the next time it
  // re-renders the head (e.g. after saving an expense).
  const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
  if (metas.length === 0) return;
  if (theme === "system" && metas.length > 1) {
    metas[0].content = THEME_COLOR.light;
    metas[0].media = "(prefers-color-scheme: light)";
    metas[1].content = THEME_COLOR.dark;
    metas[1].media = "(prefers-color-scheme: dark)";
    return;
  }
  const color = THEME_COLOR[theme === "system" ? (darkQuery().matches ? "dark" : "light") : theme];
  for (const meta of metas) {
    meta.content = color;
    meta.removeAttribute("media");
  }
}

export function ThemeProvider({ initial, children }: { initial: Theme; children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(initial);
  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
    setThemeState(t);
  }, []);
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

const OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

/** Light / Dark / System segmented control. */
export function ThemeSwitcher({ showLabels = true }: { showLabels?: boolean }) {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();
  return (
    <div role="group" aria-label={t("label")} className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-0.5">
      {OPTIONS.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          aria-label={showLabels ? undefined : t(value)}
          title={t(value)}
          onClick={() => setTheme(value)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs max-sm:py-2.5 font-medium transition-colors cursor-pointer ${
            theme === value ? "bg-primary text-white" : "text-ink-2 hover:bg-muted"
          }`}
        >
          <Icon className="size-3.5" aria-hidden />
          {showLabels && t(value)}
        </button>
      ))}
    </div>
  );
}

/** Single icon button for tight headers: flips between light and dark. */
export function ThemeToggle() {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => {
        const dark = theme === "dark" || (theme === "system" && darkQuery().matches);
        setTheme(dark ? "light" : "dark");
      }}
      aria-label={t("toggle")}
      title={t("toggle")}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-2 hover:text-ink cursor-pointer"
    >
      {/* Both icons render; CSS shows the right one, so "system" is correct on first paint too. */}
      <Moon className="size-4.5 dark:hidden" aria-hidden />
      <Sun className="hidden size-4.5 dark:block" aria-hidden />
    </button>
  );
}
