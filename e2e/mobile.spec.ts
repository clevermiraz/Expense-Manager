import { expect, test } from "@playwright/test";
import { register } from "./helpers";

test("mobile: bottom nav and floating add button", async ({ page }) => {
  await register(page);
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav).toBeVisible();
  await nav.getByRole("button", { name: "Add expense" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel(/^Amount/).fill("45");
  await dialog.getByRole("radio", { name: "Transport" }).click();
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("stat-total-value")).toHaveText("৳45");

  await nav.getByRole("link", { name: "Expenses" }).click();
  await expect(page).toHaveURL(/\/expenses/);
  await expect(page.getByTestId("expense-row")).toHaveCount(1);

  // No horizontal overflow on any main page.
  for (const path of ["/dashboard", "/expenses", "/insights", "/budgets", "/settings"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0);
  }
});
