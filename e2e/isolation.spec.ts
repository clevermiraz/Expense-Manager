import { expect, test } from "@playwright/test";
import { addExpense, register, sql, userIdFor } from "./helpers";

test("users never see each other's data", async ({ browser }) => {
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  const a = await ctxA.newPage();
  const b = await ctxB.newPage();

  const userA = await register(a, "Alice");
  await addExpense(a, { amount: "777", category: "Travel", note: "Secret trip" });
  await register(b, "Bob");

  await b.goto("/expenses");
  await expect(b.getByText("Secret trip")).toHaveCount(0);
  await expect(b.getByTestId("list-total")).toHaveText("৳0");

  // Using Alice's category id in Bob's filter shows nothing.
  const [cat] = await sql`select id from category where user_id = ${await userIdFor(userA.email)} and key = 'travel'`;
  await b.goto(`/expenses?category=${cat.id}`);
  await expect(b.getByTestId("expense-row")).toHaveCount(0);

  const csv = await (await b.request.get("/api/export")).text();
  expect(csv).not.toContain("Secret trip");

  await ctxA.close();
  await ctxB.close();
});
