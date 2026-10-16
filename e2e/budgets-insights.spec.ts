import { expect, test } from "@playwright/test";
import { addExpense, currentMonth, register, seed, shiftMonth, today } from "./helpers";

// Three full months of history: groceries 3000/3300/3600, food 1000/1200/0.
async function seedHistory(email: string) {
  const m = (d: number) => shiftMonth(currentMonth(), d);
  await seed(email, [
    { key: "groceries", amount: 3000, day: `${m(-3)}-05` },
    { key: "food", amount: 1000, day: `${m(-3)}-12` },
    { key: "groceries", amount: 3300, day: `${m(-2)}-03` },
    { key: "food", amount: 1200, day: `${m(-2)}-20` },
    { key: "groceries", amount: 3600, day: `${m(-1)}-28` },
  ]);
}

test("budget suggestions come from the last 3 months and track this month", async ({ page }) => {
  const { email } = await register(page);
  await seedHistory(email);

  await page.goto("/budgets");
  await expect(page.getByText("Suggestions are based on your average over the last 3 months.")).toBeVisible();
  const groceries = page.getByTestId("budget-row").filter({ hasText: "Groceries" });
  await expect(groceries.getByText("usually ৳3,300/month")).toBeVisible();
  const food = page.getByTestId("budget-row").filter({ hasText: "Food & dining" });
  await expect(food.getByText("usually ৳733/month")).toBeVisible();
  await expect(food.getByRole("button", { name: "Use ৳740" })).toBeVisible();

  await page.getByRole("button", { name: "Apply 2 suggestions" }).click();
  await expect(page.getByText("2 budgets set")).toBeVisible();
  await expect(groceries.getByRole("textbox")).toHaveValue("3,300");
  await expect(food.getByRole("textbox")).toHaveValue("740");

  // Spend this month and check statuses.
  await addExpense(page, { amount: "3500", category: "Groceries" });
  await addExpense(page, { amount: "600", category: "Food & dining" });
  await page.goto("/budgets");
  await expect(groceries.getByText("Over by ৳200")).toBeVisible();
  await expect(food.getByText("81% used · only ৳140 left")).toBeVisible();

  // Overall budget: set, then clear.
  const overall = page.getByLabel("Total per month");
  await overall.fill("5000");
  await overall.press("Enter");
  await expect(page.getByText("Budget saved for Total per month")).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.getByTestId("stat-budget-value")).toHaveText("৳900");
  await expect(page.getByTestId("stat-budget").getByText("82% used · close to limit")).toBeVisible();

  await page.goto("/budgets");
  await page.getByLabel("Total per month").fill("");
  await page.getByLabel("Total per month").press("Enter");
  await expect(page.getByText("Budget removed for Total per month")).toBeVisible();
  // Falls back to the sum of category budgets (3300 + 740).
  await page.goto("/dashboard");
  await expect(page.getByTestId("stat-budget-value")).toHaveText("৳60");
  await expect(page.getByTestId("stat-budget").getByText("Over budget by")).toBeVisible();
});

test("budget input is validated", async ({ page }) => {
  await register(page);
  await page.goto("/budgets");
  const groceries = page.getByTestId("budget-row").filter({ hasText: "Groceries" });
  await groceries.getByRole("textbox").fill("-20");
  await groceries.getByRole("textbox").press("Enter");
  await expect(groceries.getByText("Amount must be greater than zero.")).toBeVisible();
  await groceries.getByRole("textbox").fill("abc");
  await groceries.getByRole("textbox").press("Enter");
  await expect(groceries.getByText("Enter a valid amount.")).toBeVisible();
});

test("insights show monthly averages and where money goes", async ({ page }) => {
  const { email } = await register(page);
  await page.goto("/insights");
  await expect(page.getByText("Not enough data yet")).toBeVisible();

  await seedHistory(email);
  await addExpense(page, { amount: "150", category: "Transport" });
  await page.goto("/insights");
  await expect(page.getByTestId("stat-avg-month-value")).toHaveText("৳4,033");
  await expect(page.getByText("Based on 3 full months")).toBeVisible();
  await expect(page.getByText(/Highest month/)).toBeVisible();

  const table = page.getByRole("table", { name: "Where your money goes, month by month" });
  const rows = table.getByRole("row");
  await expect(rows).toHaveCount(4); // header + groceries + food + transport
  await expect(rows.nth(1)).toContainText("Groceries");
  await expect(rows.nth(1)).toContainText("৳3,300"); // avg column
  await expect(page.getByText(/of your spending goes to Groceries, Food & dining, Transport/)).toBeVisible();

  await page.getByRole("link", { name: "12 months" }).click();
  await expect(page).toHaveURL(/range=12/);
  // Columns start at the first month with data (3 months back), not 12 empty
  // months: category + 4 months + average.
  await expect(table.getByRole("columnheader")).toHaveCount(6);
});

test("dashboard flags categories running above their usual level", async ({ page }) => {
  const { email } = await register(page);
  await seedHistory(email);
  // Food usual = 733/month; spending 2000 this month is well above.
  await seed(email, [{ key: "food", amount: 2000, day: today() }]);
  await page.goto("/dashboard");
  await expect(page.getByTestId("unusual")).toContainText("Food & dining is running high");
});
