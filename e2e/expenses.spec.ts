import { expect, test } from "@playwright/test";
import { addExpense, currentMonth, register, shiftMonth, today } from "./helpers";

test.beforeEach(async ({ page }) => {
  await register(page);
});

test("add expenses and see dashboard totals update", async ({ page }) => {
  await addExpense(page, { amount: "250", category: "Groceries", note: "Vegetables" });
  await expect(page.getByText("Expense added")).toBeVisible();
  await addExpense(page, { amount: "1,000.50", category: "Food & dining", method: "Mobile banking" });

  await expect(page.getByTestId("stat-total-value")).toHaveText("৳1,250.5");
  await expect(page.getByText("Where it went")).toBeVisible();
  await expect(page.getByRole("button", { name: /Edit Groceries expense of ৳250/ })).toBeVisible();

  await page.goto("/expenses");
  await expect(page.getByTestId("expense-row")).toHaveCount(2);
  await expect(page.getByTestId("list-total")).toHaveText("৳1,250.5");
  await expect(page.getByTestId("day-group").first().getByRole("heading")).toHaveText("Today");
});

test("amount and date validation", async ({ page }) => {
  await page.getByRole("button", { name: "Add expense" }).first().click();
  const dialog = page.getByRole("dialog");
  const save = dialog.getByRole("button", { name: "Save", exact: true });

  await save.click();
  await expect(dialog.getByText("Enter an amount.")).toBeVisible();

  await dialog.getByLabel(/^Amount/).fill("-5");
  await save.click();
  await expect(dialog.getByText("Amount must be greater than zero.")).toBeVisible();

  await dialog.getByLabel(/^Amount/).fill("abc");
  await save.click();
  await expect(dialog.getByText("Enter a valid amount.")).toBeVisible();

  await dialog.getByLabel(/^Amount/).fill("10.555");
  await save.click();
  await expect(dialog.getByText("Use at most 2 decimal places.")).toBeVisible();

  await dialog.getByLabel(/^Amount/).fill("10");
  await dialog.getByLabel("Date").fill(`${shiftMonth(currentMonth(), 2)}-01`);
  await save.click();
  await expect(dialog.getByText("Date can't be in the future.")).toBeVisible();

  await dialog.getByLabel("Date").fill(today());
  await save.click();
  await expect(dialog).toBeHidden();
});

test("accepts Bangla digits in the amount", async ({ page }) => {
  await addExpense(page, { amount: "১২০", category: "Transport" });
  await expect(page.getByTestId("stat-total-value")).toHaveText("৳120");
});

test("save & add another keeps the dialog open", async ({ page }) => {
  await page.getByRole("button", { name: "Add expense" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel(/^Amount/).fill("40");
  await dialog.getByRole("button", { name: "Save & add another" }).click();
  await expect(page.getByText("Expense added")).toBeVisible();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel(/^Amount/)).toHaveValue("");
  await dialog.getByLabel(/^Amount/).fill("60");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("stat-total-value")).toHaveText("৳100");
});

test("edit and delete an expense", async ({ page }) => {
  await addExpense(page, { amount: "500", category: "Shopping", note: "Shoes" });
  await page.goto("/expenses");
  await page.getByRole("button", { name: /Edit Shopping expense of ৳500/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Edit expense" })).toBeVisible();
  await expect(dialog.getByLabel(/^Amount/)).toHaveValue("500");
  await dialog.getByLabel(/^Amount/).fill("450");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Expense updated")).toBeVisible();
  await expect(page.getByTestId("list-total")).toHaveText("৳450");

  await page.getByRole("button", { name: /Edit Shopping expense of ৳450/ }).click();
  await dialog.getByRole("button", { name: "Delete" }).click();
  await expect(dialog.getByRole("button", { name: "Tap again to delete" })).toBeVisible();
  await dialog.getByRole("button", { name: "Tap again to delete" }).click();
  await expect(page.getByText("Expense deleted")).toBeVisible();
  await expect(page.getByTestId("expense-row")).toHaveCount(0);
  await expect(page.getByTestId("list-total")).toHaveText("৳0");
});

test("filter by category and search notes", async ({ page }) => {
  await addExpense(page, { amount: "100", category: "Groceries", note: "Rice 5kg" });
  await addExpense(page, { amount: "80", category: "Transport", note: "Rickshaw" });
  await addExpense(page, { amount: "30", category: "Transport", note: "Bus 100% fare" });
  await page.goto("/expenses");
  await expect(page.getByTestId("expense-row")).toHaveCount(3);

  await page.getByLabel("Filter by category").selectOption({ label: "Transport" });
  await expect(page).toHaveURL(/category=/);
  await expect(page.getByTestId("expense-row")).toHaveCount(2);
  await expect(page.getByTestId("list-total")).toHaveText("৳110");

  await page.getByLabel("Filter by category").selectOption({ label: "All categories" });
  await page.getByPlaceholder("Search notes…").fill("rice");
  await expect(page.getByTestId("expense-row")).toHaveCount(1);
  // LIKE wildcards are escaped: "%" matches only a literal percent sign.
  await page.getByPlaceholder("Search notes…").fill("100%");
  await expect(page.getByTestId("expense-row")).toHaveCount(1);
  await expect(page.getByText("Bus 100% fare")).toBeVisible();
});

test("filter by how it was paid, e.g. baki", async ({ page }) => {
  await addExpense(page, { amount: "500", category: "Groceries", method: "Baki (pay later)" });
  await addExpense(page, { amount: "250", category: "Health", method: "Baki (pay later)" });
  await addExpense(page, { amount: "90", category: "Transport", method: "Card" });
  await addExpense(page, { amount: "40", category: "Transport" });
  await page.goto("/expenses");
  const paid = page.getByRole("radiogroup", { name: "Filter by how it was paid" });
  await expect(paid.getByRole("radio", { name: "All" })).toHaveAttribute("aria-checked", "true");

  await paid.getByRole("radio", { name: "Baki (pay later)" }).click();
  await expect(page).toHaveURL(/paid=baki/);
  await expect(page.getByTestId("expense-row")).toHaveCount(2);
  await expect(page.getByText("Still to pay (baki)")).toBeVisible();
  await expect(page.getByTestId("list-total")).toHaveText("৳750");

  // Combines with the category filter.
  await page.getByLabel("Filter by category").selectOption({ label: "Health" });
  await expect(page.getByTestId("expense-row")).toHaveCount(1);
  await expect(page.getByTestId("list-total")).toHaveText("৳250");
  await page.getByLabel("Filter by category").selectOption({ label: "All categories" });

  await paid.getByRole("radio", { name: "Card" }).click();
  await expect(page).toHaveURL(/paid=card/);
  await expect(page.getByTestId("list-total")).toHaveText("৳90");
  // Tapping the active chip again clears it.
  await paid.getByRole("radio", { name: "Card" }).click();
  await expect(page.getByTestId("expense-row")).toHaveCount(4);
  await expect(paid.getByRole("radio", { name: "All" })).toHaveAttribute("aria-checked", "true");
});

test("month switcher moves between months and blocks the future", async ({ page }) => {
  const prev = shiftMonth(currentMonth(), -1);
  await addExpense(page, { amount: "70", category: "Health", date: `${prev}-15` });
  await addExpense(page, { amount: "20", category: "Health" });
  await page.goto("/expenses");
  await expect(page.getByTestId("list-total")).toHaveText("৳20");
  await expect(page.getByRole("link", { name: "Next month" })).toHaveAttribute("aria-disabled", "true");

  await page.getByRole("link", { name: "Previous month" }).click();
  await expect(page).toHaveURL(new RegExp(`month=${prev}`));
  await expect(page.getByTestId("list-total")).toHaveText("৳70");

  // Future months in the URL fall back to the current month.
  await page.goto(`/expenses?month=${shiftMonth(currentMonth(), 3)}`);
  await expect(page.getByTestId("list-total")).toHaveText("৳20");
  await page.goto(`/expenses?month=garbage`);
  await expect(page.getByTestId("list-total")).toHaveText("৳20");
});

test("CSV export contains the month's expenses", async ({ page }) => {
  await addExpense(page, { amount: "99.5", category: "Food & dining", note: '=HYPERLINK("x")' });
  const res = await page.request.get(`/api/export?month=${currentMonth()}`);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/csv");
  const body = await res.text();
  expect(body.startsWith("﻿Date,Category,Amount,Paid with,Note")).toBe(true);
  expect(body).toContain(`${today()},Food & dining,99.50,Cash,"'=HYPERLINK(""x"")"`);
});
