import { expect, test } from "@playwright/test";
import { addExpense, register } from "./helpers";

test.describe("first visit, no language chosen", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("defaults to Bangla even for an English browser", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "bn");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("আপনার টাকা কোথায় যাচ্ছে, জেনে নিন");
    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Know exactly where your money goes");
  });
});

test("switch to Bangla on the landing page and it persists", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Know exactly where your money goes");
  await page.getByRole("button", { name: "BN" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("আপনার টাকা কোথায় যাচ্ছে, জেনে নিন");
  await expect(page.locator("html")).toHaveAttribute("lang", "bn");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("আপনার টাকা কোথায় যাচ্ছে, জেনে নিন");
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "আবার স্বাগতম" })).toBeVisible();
});

test("app in Bangla: labels, categories and Bangla digits", async ({ page }) => {
  const missing: string[] = [];
  page.on("console", (m) => {
    if (/MISSING_MESSAGE|IntlError/i.test(m.text())) missing.push(m.text());
  });

  await register(page);
  await addExpense(page, { amount: "1250", category: "Groceries", note: "চাল" });
  await page.getByRole("button", { name: "বাংলা" }).click();

  await expect(page.getByRole("heading", { name: "ড্যাশবোর্ড" })).toBeVisible();
  await expect(page.getByRole("link", { name: "খরচসমূহ" })).toBeVisible();
  // bn-BD formatting: Bangla digits with the taka sign.
  await expect(page.getByTestId("stat-total-value")).toHaveText(/১,২৫০/);
  await expect(page.getByText("বাজার-সদাই").first()).toBeVisible();

  for (const path of ["/expenses", "/insights", "/budgets", "/settings"]) {
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
  }
  await page.goto("/expenses");
  await expect(page.getByRole("heading", { name: "আজ" })).toBeVisible();

  // Switch back.
  await page.getByRole("button", { name: "English" }).click();
  await expect(page.getByRole("heading", { name: "Expenses" })).toBeVisible();
  expect(missing).toEqual([]);
});

test("Bangla CSV export uses translated headers", async ({ page }) => {
  await register(page);
  await addExpense(page, { amount: "10", category: "Rent" });
  await page.getByRole("button", { name: "বাংলা" }).click();
  await expect(page.getByRole("heading", { name: "ড্যাশবোর্ড" })).toBeVisible();
  const body = await (await page.request.get("/api/export")).text();
  expect(body).toContain("তারিখ,ক্যাটাগরি,পরিমাণ");
  expect(body).toContain("বাসা ভাড়া");
});
