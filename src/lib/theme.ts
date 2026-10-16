// Shared by the server (root layout reads the cookie, so the first paint is
// already in the right theme) and the client switcher.
export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];
export const defaultTheme: Theme = "light";
export const THEME_COOKIE = "theme";

/** Browser UI colour (status bar / title bar); matches --page in globals.css. */
export const THEME_COLOR = { light: "#f4f5f8", dark: "#0d0d0d" } as const;

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (themes as readonly string[]).includes(value);
}
