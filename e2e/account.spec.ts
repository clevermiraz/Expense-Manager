import { expect, test } from "@playwright/test";
import { addExpense, login, PASSWORD, register, sql, userIdFor } from "./helpers";

test("delete account: wrong password is rejected, then everything is removed", async ({ page }) => {
  const { email } = await register(page);
  await addExpense(page, { amount: "120", category: "Transport" });
  await addExpense(page, { amount: "80", category: "Groceries", method: "Baki (pay later)" });
  const userId = await userIdFor(email);
  // A budget too, so every table that references categories has rows.
  const [cat] = await sql`select id from category where user_id = ${userId} and key = 'transport'`;
  await sql`insert into budget (user_id, category_id, amount) values (${userId}, ${cat.id}, 500)`;

  await page.goto("/settings");
  await page.getByRole("button", { name: "Delete my account" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Enter your password to confirm").fill("not-my-password");
  await dialog.getByRole("button", { name: "Delete permanently" }).click();
  await expect(dialog.getByRole("alert")).toBeVisible();

  await dialog.getByLabel("Enter your password to confirm").fill(PASSWORD);
  await dialog.getByRole("button", { name: "Delete permanently" }).click();
  await expect(page).toHaveURL(/\/$/);

  for (const table of ["user", "expense", "category", "budget", "session"]) {
    const col = table === "user" ? "id" : "user_id";
    const [{ n }] = await sql`select count(*)::int as n from ${sql(table)} where ${sql(col)} = ${userId}`;
    expect(n, `${table} rows left`).toBe(0);
  }

  await login(page, email);
  await expect(page).toHaveURL(/\/login/);
});
