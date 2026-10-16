import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { InstallPrompt, ServiceWorkerRegister } from "@/components/pwa/install";
import { ThemeProvider } from "@/components/theme";
import { defaultTheme, isTheme, THEME_COLOR, THEME_COOKIE, type Theme } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bengali = Noto_Sans_Bengali({ variable: "--font-bengali", subsets: ["bengali"] });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  return {
    title: { default: t("appName"), template: `%s · ${t("appName")}` },
    description: t("tagline"),
    applicationName: t("appName"),
    // iOS / iPadOS home-screen app
    appleWebApp: { capable: true, title: t("appName"), statusBarStyle: "default" },
    formatDetection: { telephone: false },
  };
}

async function getTheme(): Promise<Theme> {
  const value = (await cookies()).get(THEME_COOKIE)?.value;
  return isTheme(value) ? value : defaultTheme;
}

export async function generateViewport(): Promise<Viewport> {
  const theme = await getTheme();
  return {
    width: "device-width",
    initialScale: 1,
    // Lets the installed app draw edge to edge; safe-area insets are padded in CSS.
    viewportFit: "cover",
    themeColor:
      theme === "system"
        ? [
            { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
            { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
          ]
        : THEME_COLOR[theme],
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);
  return (
    <html
      lang={locale}
      data-theme={theme}
      className={`${geistSans.variable} ${geistMono.variable} ${bengali.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <NextIntlClientProvider>
          <ThemeProvider initial={theme}>
            {children}
            <InstallPrompt />
          </ThemeProvider>
        </NextIntlClientProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
