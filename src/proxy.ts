import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { LOCALE_HEADER } from "@/i18n/config";

// Optimistic check only (cookie presence). Real authorization happens in
// requireUser() on every page and server action. Logged-in users visiting
// /login are redirected by the page itself (after validating the session),
// which avoids a redirect loop when the cookie is stale.
const PROTECTED = ["/dashboard", "/expenses", "/budgets", "/insights", "/settings"];

const LOCALIZED = ["/blog", "/why-hisab"];
const under = (path: string, base: string) => path === base || path.startsWith(`${base}/`);

function localeFromPath(path: string): "bn" | "en" | null {
  if (LOCALIZED.some((base) => under(path, `/en${base}`))) return "en";
  if (LOCALIZED.some((base) => under(path, base))) return "bn";
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = !!getSessionCookie(request);

  if (!hasSession && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  // Public marketing pages have one URL per language (/blog is Bangla,
  // /en/blog English, same for /why-hisab) so search engines can index both;
  // tell the i18n config which one this is.
  const blogLocale = localeFromPath(pathname);
  if (blogLocale) {
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, blogLocale);
    return NextResponse.next({ request: { headers } });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|ico|webmanifest)$).*)"],
};
