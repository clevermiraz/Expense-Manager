import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db, schema } from "@/db";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";
import { isValidTimeZone } from "@/lib/dates";

function sanitizeTimeZone(value: unknown): string {
  return typeof value === "string" && isValidTimeZone(value) ? value : "Asia/Dhaka";
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      currency: { type: "string", required: false, defaultValue: "BDT", input: false },
      timezone: { type: "string", required: false, defaultValue: "Asia/Dhaka", input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (data) => ({ data: { ...data, timezone: sanitizeTimeZone(data.timezone) } }),
        after: async (created) => {
          await db
            .insert(schema.category)
            .values(DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: created.id })))
            .onConflictDoNothing();
        },
      },
      // Also guards Better Auth's own /update-user endpoint.
      update: {
        before: async (data) =>
          "timezone" in data ? { data: { ...data, timezone: sanitizeTimeZone(data.timezone) } } : { data },
      },
    },
  },
  // Better Auth rate-limits auth endpoints in production by default. The E2E
  // suite registers many users from one IP, so it can switch this off.
  rateLimit: process.env.AUTH_RATE_LIMIT === "off" ? { enabled: false } : undefined,
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
