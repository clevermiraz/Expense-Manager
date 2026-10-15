import { expect, test } from "@playwright/test";
import { addExpense, login, PASSWORD, register } from "./helpers";

test("custom category: create, use, reject duplicates, delete moves expenses to Other", async ({ page }) => {
  await register(page);
  await page.goto("/settings");
  await page.getByRole("button", { name: "Add category" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Category name").fill("Pets");
  await dialog.getByRole("radio", { name: "dog" }).click();
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Category saved")).toBeVisible();
  await expect(page.getByTestId("category-list")).toContainText("Pets");

  await page.getByRole("button", { name: "Add category" }).click();
  await dialog.getByLabel("Category name").fill("  pets ");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog.getByText("You already have a category with this name.")).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();

  await addExpense(page, { amount: "300", category: "Pets", note: "Cat food" });
  await page.goto("/expenses");
  await expect(page.getByRole("button", { name: /Edit Pets expense/ })).toBeVisible();

  await page.goto("/settings");
  await page.getByRole("button", { name: "Edit Pets" }).click();
  await dialog.getByRole("button", { name: "Delete" }).click();
  await dialog.getByRole("button", { name: /Tap again/ }).click();
  await expect(page.getByText("Category deleted")).toBeVisible();

  await page.goto("/expenses");
  await expect(page.getByRole("button", { name: /Edit Other expense of ৳300/ })).toBeVisible();
});

test("built-in Other cannot be deleted; built-in names are not editable", async ({ page }) => {
  await register(page);
  await page.goto("/settings");
  await page.getByRole("button", { name: "Edit Other" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Delete" })).toHaveCount(0);
  await expect(dialog.getByLabel("Category name")).toHaveCount(0);
});

test("change currency to USD", async ({ page }) => {
  await register(page);
  await page.goto("/settings");
  await page.getByLabel("Currency").selectOption("USD");
  await page.getByRole("button", { name: "Save", exact: true }).first().click();
  await expect(page.getByText("Profile saved")).toBeVisible();
  await addExpense(page, { amount: "12.5", category: "Food & dining" });
  await page.goto("/dashboard");
  await expect(page.getByTestId("stat-total-value")).toHaveText("$12.5");
});

test("change password", async ({ page, browser }) => {
  const { email } = await register(page);
  await page.goto("/settings");
  await page.getByLabel("Current password").fill("wrong-password");
  await page.getByLabel("New password").fill("new-password-123");
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByText("Current password is incorrect.")).toBeVisible();

  await page.getByLabel("Current password").fill(PASSWORD);
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByText("Password updated.")).toBeVisible();

  const other = await browser.newPage();
  await login(other, email, PASSWORD);
  await expect(other.getByText("Email or password is incorrect.")).toBeVisible();
  await login(other, email, "new-password-123");
  await expect(other).toHaveURL(/\/dashboard/);
  await other.close();
});
