import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Every page in this app is per-user and request-time, so Cache Components is
// left off and pages render dynamically.
const nextConfig: NextConfig = {
  // Don't advertise the framework in every response.
  poweredByHeader: false,
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
        // Basic hardening for every page and API response.
        source: "/:path*",
        headers: [
          // Only this site may frame its pages (stops clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // Ignored over plain http (localhost); applies once served over https.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
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
