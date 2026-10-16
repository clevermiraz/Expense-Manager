import type { MetadataRoute } from "next";
import { ARTICLES, blogPath, whyPath } from "@/content/learn";
import { SITE_URL } from "@/lib/site";

// Public pages only; the app itself is behind a login.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;
  const both = (slug?: string) => ({ bn: url(blogPath("bn", slug)), en: url(blogPath("en", slug)) });
  const latest = ARTICLES.map((a) => a.updated ?? a.published).sort().at(-1);
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    ...(["bn", "en"] as const).map((l) => ({
      url: url(whyPath(l)),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: { languages: { bn: url(whyPath("bn")), en: url(whyPath("en")) } },
    })),
    ...(["bn", "en"] as const).map((l) => ({
      url: url(blogPath(l)),
      lastModified: latest,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: { languages: both() },
    })),
    ...ARTICLES.flatMap((a) =>
      (["bn", "en"] as const).map((l) => ({
        url: url(blogPath(l, a.slug)),
        lastModified: a.updated ?? a.published,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages: both(a.slug) },
      })),
    ),
    { url: url("/register"), changeFrequency: "yearly", priority: 0.5 },
  ];
}
