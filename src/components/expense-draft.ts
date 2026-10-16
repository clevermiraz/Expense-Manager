"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { deleteExpense, saveExpense } from "@/app/actions/expenses";
import { useApp } from "@/components/app-context";
import { toast } from "@/components/ui/toast";
import type { ExpenseRow } from "@/lib/data";
import type { PaymentMethod } from "@/lib/default-categories";
import { normalizeAmount } from "@/lib/numbers";
import { useErrorText } from "@/lib/use-error-text";

export type ExpenseDefaults = { spentOn?: string; categoryId?: string };

/**
 * State and save/delete logic shared by the desktop form and the phone
 * step-by-step sheet, so both validate and save the same way.
 */
export function useExpenseDraft(
  expense: ExpenseRow | null,
  defaults: ExpenseDefaults | undefined,
  onDone: () => void,
  { preselectCategory = true }: { preselectCategory?: boolean } = {},
) {
  const t = useTranslations("expenseForm");
  const te = useErrorText();
  const { categories, today } = useApp();

  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [categoryId, setCategoryId] = useState(
    expense?.categoryId ?? defaults?.categoryId ?? (preselectCategory ? (categories[0]?.id ?? "") : ""),
  );
  const [spentOn, setSpentOn] = useState(expense?.spentOn ?? defaults?.spentOn ?? today);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    (expense?.paymentMethod as PaymentMethod) ?? "cash",
  );
  const [note, setNote] = useState(expense?.note ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  /** Client-side amount check; returns the error key, if any. */
  function checkAmount(): string | null {
    const normalized = normalizeAmount(amount);
    if (normalized === "") return "amountRequired";
    const value = Number(normalized);
    if (!Number.isFinite(value)) return "amountInvalid";
    if (value <= 0) return "amountPositive";
    return null;
  }

  /**
   * `onInvalid` gets the server's field errors (e.g. to jump back to the step
   * that has the problem); `onAddAnother` runs after a "save & add another".
   */
  function submit(
    addAnother: boolean,
    { onInvalid, onAddAnother }: { onInvalid?: (fields: Record<string, string>) => void; onAddAnother?: () => void } = {},
  ) {
    const amountError = checkAmount();
    if (amountError) {
      setErrors({ amount: amountError });
      onInvalid?.({ amount: amountError });
      return;
    }
    setErrors({});
    startTransition(async () => {
      const res = await saveExpense(expense?.id ?? null, {
        amount: normalizeAmount(amount),
        categoryId,
        spentOn,
        note,
        paymentMethod,
      });
      if (!res.ok) {
        if (res.fields) {
          setErrors(res.fields);
          onInvalid?.(res.fields);
        } else toast(te(res.error), "error");
        return;
      }
      toast(expense ? t("updated") : t("saved"));
      if (addAnother) {
        setAmount("");
        setNote("");
        onAddAnother?.();
      } else {
        onDone();
      }
    });
  }

  function remove() {
    if (!expense) return;
    if (!confirmingDelete) return setConfirmingDelete(true);
    startDelete(async () => {
      const res = await deleteExpense(expense.id);
      if (!res.ok) return toast(te(res.error), "error");
      toast(t("deleted"));
      onDone();
    });
  }

  return {
    amount,
    setAmount,
    categoryId,
    setCategoryId,
    spentOn,
    setSpentOn,
    paymentMethod,
    setPaymentMethod,
    note,
    setNote,
    errors,
    setErrors,
    checkAmount,
    err: (k: string) => (errors[k] ? te(errors[k]) : null),
    pending,
    deleting,
    confirmingDelete,
    submit,
    remove,
  };
}

export type ExpenseDraft = ReturnType<typeof useExpenseDraft>;
