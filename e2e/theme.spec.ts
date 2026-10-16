import { expect, test } from "@playwright/test";
import { addExpense, register } from "./helpers";

test("light by default, even when the device prefers dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(244, 245, 248)");
});

test("header toggle switches to dark and it persists", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch light / dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(13, 13, 13)");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("settings: Light / Dark / System", async ({ page }) => {
  await register(page);
  await page.goto("/settings");
  const group = page.locator("main").getByRole("group", { name: "Appearance" });
  await group.getByRole("button", { name: "System" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");

  // "System" follows the device.
  await page.emulateMedia({ colorScheme: "dark" });
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(13, 13, 13)");
  await page.emulateMedia({ colorScheme: "light" });
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(244, 245, 248)");

  await group.getByRole("button", { name: "Light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(group.getByRole("button", { name: "Light" })).toHaveAttribute("aria-pressed", "true");
});

test("switching theme, then saving an expense, doesn't break the page", async ({ page }) => {
  // The toggle used to replace the theme-color <meta> tags that React owns, so
  // the next re-render of the page (after a save) crashed with removeChild.
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await register(page);
  await page.getByRole("group", { name: "Appearance" }).getByRole("button", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute("content", "#0d0d0d");
  await addExpense(page, { amount: "75", category: "Transport" });
  await expect(page.getByTestId("stat-total-value")).toHaveText("৳75");
  await page.getByRole("link", { name: "Expenses" }).first().click();
  await expect(page.getByTestId("expense-row")).toHaveCount(1);
  expect(errors).toEqual([]);
});
