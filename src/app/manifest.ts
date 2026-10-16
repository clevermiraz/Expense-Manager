import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [t, tn] = await Promise.all([getTranslations("common"), getTranslations("nav")]);
  return {
    id: "/",
    name: t("appName"),
    short_name: t("appName"),
    description: t("tagline"),
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f4f5f8",
    theme_color: "#2a78d6",
    categories: ["finance", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: tn("addExpense"),
        url: "/dashboard?add=1",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      { name: tn("expenses"), url: "/expenses" },
      { name: tn("insights"), url: "/insights" },
    ],
  };
}
