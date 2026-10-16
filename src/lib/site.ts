/** Public base URL, used for canonical links, the sitemap and structured data. */
export const SITE_URL = (process.env.SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3100").replace(/\/$/, "");

/**
 * Link-preview image (WhatsApp, Facebook…). Pages that set their own
 * `openGraph` replace the root layout's, image included, so each one adds this.
 */
export const OG_IMAGE = { url: "/icons/icon-512.png", width: 512, height: 512, alt: "Hisab" };
