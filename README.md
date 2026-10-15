# Hisab (হিসাব): personal expense manager

Log daily expenses in seconds, see where your money goes month by month, and set budgets based on your real spending. Available in English and বাংলা.

## Features

- **Accounts:** open email/password registration, login, sign out, change password (signs out other devices). Auth endpoints are rate-limited in production.
- **Daily entry:** a quick add dialog (amount, category, date, payment method, note), "save & add another", edit and delete. The amount field accepts Bangla digits (১২০).
- **Dashboard (per month):** total vs last month, daily average, projected month-end, budget left with a pace marker, daily spending chart, category breakdown, recent expenses, budget status, and alerts when a category runs above its usual level.
- **Expenses:** month navigation, category filter, note search, totals per day, CSV export (Excel-safe UTF-8).
- **Insights (3/6/12 months):** monthly trend, a category × month heatmap with averages, spending by weekday, and plain-language tips.
- **Budgets:** an overall limit plus per-category monthly limits. Suggestions come from your average over the last 3 full months, with one click to apply them all.
- **Settings:** profile, currency (BDT/USD/EUR/GBP/INR), time zone, language, custom categories (icon and color), export all data.
- **i18n:** English and Bangla through `next-intl`. Numbers, dates and money are formatted per locale (Bangla shows ১,২৫০৳).
- Responsive, with a bottom nav and floating add button on mobile, and light/dark mode.

## Stack

Next.js 16 (App Router, Server Actions, `proxy.ts`), React 19, Tailwind CSS 4, Better Auth, Drizzle ORM + Postgres (Neon), next-intl, Recharts, Zod, and Playwright for end-to-end tests.

## Run locally

```bash
npm install
cp .env.example .env.local          # then fill in the values (see below)
npm run db:migrate                  # creates the tables
npm run dev                         # http://localhost:3100
```

For a throwaway local database:

```bash
docker run -d --name expense-manager-pg -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=expense_manager -p 54329:5432 postgres:17-alpine
# DATABASE_URL=postgres://postgres:postgres@localhost:54329/expense_manager
```

## Using Neon

1. Create a project at https://neon.tech (choose a region close to you, e.g. Singapore for Bangladesh).
2. Copy the **pooled** connection string from *Connection Details* into `DATABASE_URL`, keeping `?sslmode=require`.
3. Run `npm run db:migrate` once. It applies `drizzle/0000_init.sql`.

## Environment variables

| Name | What |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | Random secret, `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Public URL of the app (`https://your-domain` in production) |
| `AUTH_RATE_LIMIT` | Set to `off` **only** for the E2E test server |

## Deploy (Vercel)

Import the repo, set the three env vars above (with `BETTER_AUTH_URL` set to your production URL), and deploy. Run `npm run db:migrate` against the production database after any schema change.

## Scripts

| Script | |
|---|---|
| `npm run dev` / `build` / `start` | Next.js on port 3100 |
| `npm run db:generate` | Create a migration after editing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Browse the database |
| `npm run typecheck` / `lint` | Static checks |
| `npm run check:messages` | Make sure `en.json` and `bn.json` have the same keys |
| `npm run test:e2e` | Playwright suite (uses your installed Chrome). Against a production build: `npm run build && AUTH_RATE_LIMIT=off BETTER_AUTH_URL=http://localhost:3200 npx next start -p 3200`, then `E2E_PORT=3200 npm run test:e2e` |

## Project layout

```
src/app/(auth)        login / register
src/app/(app)         dashboard, expenses, insights, budgets, settings (all require login)
src/app/actions       server actions; each re-checks the session and scopes queries by user id
src/app/api           Better Auth handler, CSV export
src/lib/data.ts       all read queries (always filtered by user id)
src/db/schema.ts      Drizzle schema (auth tables + category, expense, budget)
messages/{en,bn}.json translations
e2e/                  Playwright tests
```
