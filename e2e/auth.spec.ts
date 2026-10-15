import { expect, test } from "@playwright/test";
import { login, PASSWORD, register } from "./helpers";

test("protected pages redirect to login", async ({ page }) => {
  for (const path of ["/dashboard", "/expenses", "/insights", "/budgets", "/settings"]) {
    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(`/login\\?next=${encodeURIComponent(path)}`));
  }
});

test("register validates fields client-side", async ({ page }) => {
  await page.goto("/register");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Password must be at least 8 characters.")).toBeVisible();

  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Password must be at least 8 characters.")).toBeVisible();
});

test("register, see seeded categories, sign out, log back in", async ({ page }) => {
  const { name, email } = await register(page, "Miraz Hossain");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText(`Hi Miraz`)).toBeVisible();
  await expect(page.getByTestId("user-name")).toHaveText(name);
  await expect(page.getByText("No expenses this month yet")).toBeVisible();

  // Default categories exist for the new user.
  await page.goto("/settings");
  await expect(page.getByTestId("category-list").getByRole("listitem")).toHaveCount(14);

  await page.getByRole("button", { name: "Sign out" }).first().click();
  await expect(page).toHaveURL(/\/login/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);

  await login(page, email);
  await expect(page).toHaveURL(/\/dashboard/);
});

test("duplicate email is rejected", async ({ page, browser }) => {
  const { email } = await register(page);
  const other = await browser.newPage();
  await other.goto("/register");
  await other.getByLabel("Your name").fill("Someone");
  await other.getByLabel("Email").fill(email.toUpperCase());
  await other.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await other.getByRole("button", { name: "Create account" }).click();
  await expect(other.getByText("An account with this email already exists.")).toBeVisible();
  await other.close();
});

test("wrong password shows an error", async ({ page, browser }) => {
  const { email } = await register(page);
  const other = await browser.newPage();
  await login(other, email, "not-the-password");
  await expect(other.getByText("Email or password is incorrect.")).toBeVisible();
  await expect(other).toHaveURL(/\/login/);
  await other.close();
});

test("login honours ?next but never redirects off-site", async ({ page, browser }) => {
  const { email } = await register(page);
  const a = await browser.newPage();
  await a.goto("/budgets");
  await expect(a).toHaveURL(/\/login\?next=%2Fbudgets/);
  await a.getByLabel("Email").fill(email);
  await a.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await a.getByRole("button", { name: "Log in" }).click();
  await expect(a).toHaveURL(/\/budgets$/);
  await a.close();

  const b = await browser.newPage();
  await b.goto("/login?next=//evil.example.com");
  await b.getByLabel("Email").fill(email);
  await b.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await b.getByRole("button", { name: "Log in" }).click();
  await expect(b).toHaveURL(/localhost:\d+\/dashboard/);
  await b.close();
});

test("logged-in user visiting /login goes to dashboard", async ({ page }) => {
  await register(page);
  await page.goto("/login");
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard/);
});
