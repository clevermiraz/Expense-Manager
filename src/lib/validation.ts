import { z } from "zod";
import { CURRENCIES, PAYMENT_METHODS } from "@/lib/default-categories";
import { isValidDay, isValidTimeZone } from "@/lib/dates";

const money = z.coerce
  .number({ error: "amountInvalid" })
  .refine((v) => Number.isFinite(v), "amountInvalid")
  .refine((v) => v > 0, "amountPositive")
  .refine((v) => v <= 999_999_999, "amountTooLarge")
  .refine((v) => Math.abs(Math.round(v * 100) - v * 100) < 1e-6, "amountDecimals");

export const expenseInput = z.object({
  amount: money,
  categoryId: z.uuid({ error: "categoryRequired" }),
  spentOn: z.string().refine(isValidDay, "dateInvalid"),
  note: z
    .string()
    .trim()
    .max(200, "noteTooLong")
    .optional()
    .transform((v) => (v ? v : null)),
  paymentMethod: z.enum(PAYMENT_METHODS, { error: "paymentInvalid" }),
});
export type ExpenseInput = z.input<typeof expenseInput>;

export const categoryInput = z.object({
  name: z.string().trim().min(1, "nameRequired").max(40, "nameTooLong"),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "colorInvalid"),
  icon: z.string().regex(/^[a-z0-9-]{1,40}$/, "iconInvalid"),
});

export const budgetInput = z.object({
  categoryId: z.uuid().nullable(),
  amount: money.nullable(),
});

export const profileInput = z.object({
  name: z.string().trim().min(1, "nameRequired").max(80, "nameTooLong"),
  currency: z.enum(CURRENCIES, { error: "currencyInvalid" }),
  timezone: z.string().refine(isValidTimeZone, "timezoneInvalid"),
});

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
