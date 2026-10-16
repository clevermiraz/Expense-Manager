import { expect, test } from "@playwright/test";
import { addExpense, register, sql } from "./helpers";

test("dashboard tip links to a research article with sources", async ({ page }) => {
  await register(page);
  const tip = page.getByTestId("tip-card");
  await expect(tip).toContainText("Did you know?");
  await tip.click();
  // English UI → the English blog URL.
  await expect(page).toHaveURL(/\/en\/blog\/[a-z-]+$/);
  await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
  const links = page.locator("article ol a[target=_blank]");
  expect(await links.count()).toBeGreaterThan(0);
  await expect(links.first()).toHaveAttribute("rel", /noopener/);
  // Signed in: the call to action opens the add sheet in the app.
  await page.getByRole("link", { name: "Add an expense" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("the blog is public, in Bangla at /blog and English at /en/blog", async ({ page, context }) => {
  await context.clearCookies();
  await page.goto("/blog");
  await expect(page.locator("html")).toHaveAttribute("lang", "bn");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("টিপস ও লেখা");
  await expect(page.locator("main ul > li")).toHaveCount(6);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en\/blog$/);

  await page.getByRole("link", { name: /বাকির হিসাব/ }).click();
  await expect(page).toHaveURL(/\/blog\/baki$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/blog\/baki$/);
  expect(await page.locator('script[type="application/ld+json"]').first().textContent()).toContain('"BlogPosting"');
  // Signed out: invited to sign up.
  await expect(page.getByRole("link", { name: "ফ্রিতে অ্যাকাউন্ট খুলুন" })).toHaveAttribute("href", "/register");

  // The language switch goes to the English URL of the same article.
  await page.getByRole("group", { name: "ভাষা" }).getByText("EN").click();
  await expect(page).toHaveURL(/\/en\/blog\/baki$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Baki: keep it on paper, not in your head");

  await page.goto("/blog/nope");
  await expect(page.getByText(/404|not found/i).first()).toBeVisible();
});

test("'Why use Hisab?' page: public, both languages, FAQ for search engines", async ({ page, context }) => {
  await context.clearCookies();
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "কেন হিসাব?" }).click();
  await expect(page).toHaveURL(/\/why-hisab$/);
  await expect(page).toHaveTitle("কেন হিসাব ব্যবহার করবেন? খরচের হিসাব রাখার সহজ অ্যাপ");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("কেন হিসাব ব্যবহার করবেন?");
  await expect(page.getByRole("table")).toBeVisible();
  // FAQ answers open on click and are described for search engines.
  await page.getByText("ইন্টারনেট ছাড়া চলবে?").click();
  await expect(page.getByText(/ইন্টারনেট সংযোগ লাগে/)).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(ld).toContain('"FAQPage"');
  await expect(page.getByRole("link", { name: "ফ্রিতে অ্যাকাউন্ট খুলুন" }).first()).toHaveAttribute("href", "/register");

  await page.getByRole("group", { name: "ভাষা" }).getByText("EN").click();
  await expect(page).toHaveURL(/\/en\/why-hisab$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Why use Hisab?");
});

test("landing page explains why, and links to the blog", async ({ page, context }) => {
  await context.clearCookies();
  await page.goto("/");
  await expect(page).toHaveTitle("হিসাব: প্রতিদিনের খরচের হিসাব রাখার সহজ অ্যাপ");
  await expect(page.getByRole("heading", { name: "খরচ লিখে রাখলে কী লাভ?" })).toBeVisible();
  await page.getByRole("link", { name: /১৩৮/ }).click();
  await expect(page).toHaveURL(/\/blog\/write-it-down$/);
});

test("sitemap and robots point search engines at the public pages only", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/blog/monthly-budget</loc>");
  expect(sitemap).toContain("/en/blog/monthly-budget</loc>");
  expect(sitemap).not.toContain("/dashboard");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /dashboard");
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
});

test("streak card counts today's logging and offers a reminder once", async ({ page }) => {
  await register(page);
  // A brand-new account has no streak card yet, only the tip.
  await expect(page.getByTestId("habit-card")).toHaveCount(0);
  await addExpense(page, { amount: "60", category: "Food & dining" });
  const card = page.getByTestId("habit-card");
  await expect(card.getByTestId("streak")).toHaveText("1 day in a row");
  await expect(card).toContainText("Today's spending is logged. Nice!");

  const ask = card.getByTestId("reminder-ask");
  await expect(ask).toContainText("9 PM");
  await ask.getByRole("button", { name: "Not now" }).first().click();
  await expect(ask).toBeHidden();
  await page.reload();
  await expect(page.getByTestId("habit-card")).toBeVisible();
  await expect(page.getByTestId("reminder-ask")).toBeHidden();
});

test("reminder time is saved from settings", async ({ page }) => {
  const { email } = await register(page);
  await page.goto("/settings");
  const card = page.locator("section", { hasText: "Daily reminder" });
  await expect(card.getByRole("button", { name: "Turn on reminders" })).toBeVisible();
  await card.getByLabel("Remind me at").selectOption({ label: "10 PM" });
  await expect(page.getByText("Reminder time saved")).toBeVisible();
  const [row] = await sql`select r.hour from reminder r join "user" u on u.id = r.user_id where u.email = ${email}`;
  expect(row.hour).toBe(22);
  await page.reload();
  await expect(card.getByLabel("Remind me at")).toHaveValue("22");
});

test("reminder job needs the cron secret", async ({ request }) => {
  expect((await request.get("/api/cron/reminders")).status()).toBe(401);
  expect((await request.get("/api/cron/reminders", { headers: { authorization: "Bearer wrong" } })).status()).toBe(401);
  const ok = await request.get("/api/cron/reminders", { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } });
  expect(ok.status()).toBe(200);
  expect(await ok.json()).toEqual(expect.objectContaining({ sent: expect.any(Number) }));
});
