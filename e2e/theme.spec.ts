import { expect, test } from "@playwright/test";
import { register } from "./helpers";

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
