import { expect, test } from "@playwright/test";
import { register } from "./helpers";

test("mobile: bottom nav and floating add button", async ({ page }) => {
  await register(page);
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav).toBeVisible();
  await nav.getByRole("button", { name: "Add expense" }).click();
  const dialog = page.getByRole("dialog");
  // Phones get the step-by-step sheet: keypad → category → details.
  await dialog.getByRole("button", { name: "4", exact: true }).click();
  await dialog.getByRole("button", { name: "5", exact: true }).click();
  await dialog.getByRole("button", { name: "Next" }).click();
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

test("mobile: sign out from the header account menu", async ({ page }) => {
  const { name, email } = await register(page);
  await page.getByRole("button", { name: "Open account menu" }).click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByText(name)).toBeVisible();
  await expect(sheet.getByText(email)).toBeVisible();
  await sheet.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login/);
});

test("mobile: step-by-step add sheet", async ({ page }) => {
  await register(page);
  const nav = page.getByRole("navigation", { name: "Main" });
  await nav.getByRole("button", { name: "Add expense" }).click();
  const dialog = page.getByRole("dialog");
  const amount = dialog.getByTestId("amount-display");

  // Step 1: the keypad, so the phone keyboard never opens.
  await expect(dialog.getByText("Step 1 of 3 · Amount")).toBeVisible();
  await expect(dialog.locator("input")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Next" }).click();
  await expect(dialog.getByText("Enter an amount.")).toBeVisible();
  await page.keyboard.type("1250.555"); // a hardware keyboard works too; 3rd decimal is ignored
  await expect(amount).toContainText("1,250.55");
  await expect(dialog.getByText("Enter an amount.")).toBeHidden();
  await dialog.getByRole("button", { name: "Delete last digit" }).click();
  await expect(amount).toContainText("1,250.5");
  await dialog.getByRole("button", { name: "Next" }).click();

  // Step 2: nothing preselected; Back keeps the amount.
  await expect(dialog.getByText("Step 2 of 3 · Category")).toBeVisible();
  await expect(dialog.locator('[role="radio"][aria-checked="true"]')).toHaveCount(0);
  await dialog.getByRole("button", { name: "Back" }).click();
  await expect(amount).toContainText("1,250.5");
  await dialog.getByRole("button", { name: "Next" }).click();
  await dialog.getByRole("radio", { name: "Groceries" }).click();

  // Step 3: summary, optional details, save & add another.
  await expect(dialog.getByText("Step 3 of 3 · Details")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Change amount" })).toContainText("1,250.5");
  // The note opens in its own box at the top; Enter closes it but doesn't save.
  await dialog.getByRole("button", { name: "Add a note" }).click();
  const noteBox = page.getByRole("dialog", { name: "Note" });
  await expect(noteBox.getByLabel(/^Note/)).toBeFocused();
  await page.keyboard.type("Rice and lentils");
  await page.keyboard.press("Enter");
  await expect(noteBox).toBeHidden();
  await expect(page.getByText("Expense added")).toBeHidden();
  await expect(dialog.getByRole("button", { name: "Note: Rice and lentils" })).toBeVisible();
  await dialog.getByRole("button", { name: "Yesterday" }).click();
  await dialog.getByRole("radio", { name: /Baki/ }).click();
  await expect(dialog.getByText(/pay it later/)).toBeVisible();
  await dialog.getByRole("button", { name: "Save & add another" }).click();
  await expect(page.getByText("Expense added")).toBeVisible();

  // Back to an empty keypad; the category is remembered.
  await expect(dialog.getByText("Step 1 of 3 · Amount")).toBeVisible();
  await expect(amount).toHaveText(/৳\s*0/);
  await page.keyboard.type("80");
  await page.keyboard.press("Enter");
  await expect(dialog.getByRole("radio", { name: "Groceries" })).toHaveAttribute("aria-checked", "true");
  await dialog.getByRole("radio", { name: "Groceries" }).click();
  // The note used before for Groceries is offered as a one-tap suggestion.
  const used = dialog.getByRole("group", { name: "Used before" });
  await expect(used.getByRole("button", { name: "Rice and lentils" })).toBeVisible();
  await used.getByRole("button", { name: "Rice and lentils" }).click();
  await expect(dialog.getByRole("button", { name: "Note: Rice and lentils" })).toBeVisible();
  await dialog.getByRole("button", { name: "Clear note" }).click();
  await expect(dialog.getByRole("button", { name: "Add a note" })).toBeVisible();
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();

  // Editing opens on the summary; amount and category are one tap away.
  await nav.getByRole("link", { name: "Expenses" }).click();
  await expect(page.getByTestId("expense-row")).toHaveCount(2);
  await page.getByTestId("expense-row").filter({ hasText: "Rice and lentils" }).click();
  await expect(dialog.getByRole("button", { name: "Back" })).toBeHidden();
  await expect(dialog.getByRole("button", { name: "Note: Rice and lentils" })).toBeVisible();
  await dialog.getByRole("button", { name: "Change amount" }).click();
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.type("99");
  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(dialog.getByRole("button", { name: "Change amount" })).toContainText("199");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("expense-row").filter({ hasText: "Rice and lentils" })).toContainText("৳199");
});
