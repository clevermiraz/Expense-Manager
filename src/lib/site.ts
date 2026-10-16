/** Public base URL, used for canonical links, the sitemap and structured data. */
export const SITE_URL = (process.env.SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3100").replace(/\/$/, "");
