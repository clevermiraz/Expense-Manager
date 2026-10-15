import { expect, type Page } from "@playwright/test";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

export const sql = postgres(process.env.DATABASE_URL!, { max: 2, prepare: false });

export const PASSWORD = "correct-horse-42";

export function uniqueEmail(tag = "user") {
  return `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

/** Today / month in Asia/Dhaka (the timezone the tests run the browser in). */
export function today(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date());
}
export function currentMonth(): string {
  return today().slice(0, 7);
}
export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const total = y * 12 + (m - 1) + delta;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

export async function register(page: Page, name = "Test User", email = uniqueEmail()) {
  await page.goto("/register");
  await page.getByLabel("Your name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  return { name, email };
}

export async function login(page: Page, email: string, password = PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
}

export async function addExpense(
  page: Page,
  opts: { amount: string; category?: string; note?: string; date?: string; method?: string },
) {
  await page.getByRole("button", { name: "Add expense" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel(/^Amount/).fill(opts.amount);
  if (opts.category) await dialog.getByRole("radio", { name: opts.category }).click();
  if (opts.date) await dialog.getByLabel("Date").fill(opts.date);
  if (opts.method) await dialog.getByLabel("Paid with").selectOption({ label: opts.method });
  if (opts.note) await dialog.getByLabel("Note").fill(opts.note);
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();
}

export async function userIdFor(email: string): Promise<string> {
  const [row] = await sql`select id from "user" where email = ${email}`;
  return row.id;
}

/** Insert expenses directly (fast seeding of past months). */
export async function seed(email: string, rows: { key: string; amount: number; day: string; note?: string }[]) {
  const userId = await userIdFor(email);
  const cats = await sql`select id, key from category where user_id = ${userId}`;
  const byKey = new Map(cats.map((c) => [c.key, c.id]));
  for (const r of rows) {
    await sql`insert into expense (user_id, category_id, amount, spent_on, note)
              values (${userId}, ${byKey.get(r.key)!}, ${r.amount}, ${r.day}, ${r.note ?? null})`;
  }
}
