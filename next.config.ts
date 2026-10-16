import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Every page in this app is per-user and request-time, so Cache Components is
// left off and pages render dynamically.
const nextConfig: NextConfig = {
  experimental: {
    // Going back to a tab within 30s shows it instantly from the client cache.
    // Saving anything calls revalidatePath(), which clears this cache.
    staleTimes: { dynamic: 30 },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        // Browsers must always re-check the service worker so updates roll out.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
