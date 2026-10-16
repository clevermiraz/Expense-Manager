import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Personal pages behind the login, and the API, have nothing to index.
      disallow: ["/dashboard", "/expenses", "/insights", "/budgets", "/settings", "/api/", "/offline"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
