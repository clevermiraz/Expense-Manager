"use client";

import { HandCoins, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useErrorText } from "@/lib/use-error-text";
import { useMemo, useRef, useState, useTransition } from "react";
import { deleteExpense, saveExpense } from "@/app/actions/expenses";
import { useApp, useCategoryLabel } from "@/components/app-context";
import { CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Field, Input, inputClass } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import type { ExpenseRow } from "@/lib/data";
import { PAYMENT_METHODS, type PaymentMethod } from "@/lib/default-categories";
import { intlLocale, isLocale } from "@/i18n/config";
import { normalizeAmount } from "@/lib/numbers";

type Props = {
  open: boolean;
  expense: ExpenseRow | null;
  defaults?: { spentOn?: string; categoryId?: string };
  onClose: () => void;
};

export function ExpenseDialog({ open, expense, defaults, onClose }: Props) {
  const t = useTranslations("expenseForm");
  const tc = useTranslations("common");
  return (
    <Dialog open={open} onClose={onClose} title={expense ? t("editTitle") : t("addTitle")} closeLabel={tc("close")}>
      <ExpenseForm key={`${expense?.id ?? "new"}-${open}`} expense={expense} defaults={defaults} onDone={onClose} />
    </Dialog>
  );
}

function ExpenseForm({
  expense,
  defaults,
  onDone,
}: {
  expense: ExpenseRow | null;
  defaults?: { spentOn?: string; categoryId?: string };
  onDone: () => void;
}) {
  const t = useTranslations("expenseForm");
  const te = useErrorText();
  const tp = useTranslations("paymentMethods");
  const { categories, today, currency } = useApp();
  const label = useCategoryLabel();
  const amountRef = useRef<HTMLInputElement>(null);
  const locale = useLocale();
  // e.g. "৳" for BDT, shown inside the amount field
  const symbol = useMemo(
    () =>
      new Intl.NumberFormat(isLocale(locale) ? intlLocale[locale] : locale, {
        style: "currency",
        currency,
        // "৳" rather than "BDT" in English, so it fits inside the field
        currencyDisplay: "narrowSymbol",
      })
        .formatToParts(0)
        .find((p) => p.type === "currency")?.value ?? currency,
    [locale, currency],
  );

  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [categoryId, setCategoryId] = useState(expense?.categoryId ?? defaults?.categoryId ?? categories[0]?.id ?? "");
  const [spentOn, setSpentOn] = useState(expense?.spentOn ?? defaults?.spentOn ?? today);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    (expense?.paymentMethod as PaymentMethod) ?? "cash",
  );
  const [note, setNote] = useState(expense?.note ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function submit(addAnother: boolean) {
    if (normalizeAmount(amount) === "") return setErrors({ amount: "amountRequired" });
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
        if (res.fields) setErrors(res.fields);
        else toast(te(res.error), "error");
        return;
      }
      toast(expense ? t("updated") : t("saved"));
      if (addAnother) {
        setAmount("");
        setNote("");
        amountRef.current?.focus();
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

  const err = (k: string) => (errors[k] ? te(errors[k]) : null);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit(false);
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <DialogBody>
        <div className="flex flex-col gap-5">
          <Field label={t("amount", { currency })} htmlFor="amount" error={err("amount")}>
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-ink-3"
              >
                {symbol}
              </span>
              <Input
                ref={amountRef}
                data-autofocus
                id="amount"
                name="amount"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-invalid={!!errors.amount}
                className="h-16 rounded-2xl pl-12 text-3xl font-semibold tracking-tight tabular sm:h-16 sm:text-3xl"
              />
            </div>
          </Field>

          <fieldset className="flex flex-col gap-1.5">
            <legend className="mb-1.5 text-sm font-medium text-ink-2">{t("category")}</legend>
            <div role="radiogroup" aria-label={t("category")} className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {categories.map((c) => {
                const active = c.id === categoryId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setCategoryId(c.id)}
                    className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl border px-1 py-2 text-[11px] leading-tight transition-colors cursor-pointer sm:text-xs ${
                      active
                        ? "border-primary bg-primary-soft font-medium text-ink ring-1 ring-primary"
                        : "border-line text-ink-2 hover:bg-muted"
                    }`}
                  >
                    <CategoryIcon icon={c.icon} color={c.color} size="sm" />
                    <span className="line-clamp-2 w-full text-center break-words">{label(c)}</span>
                  </button>
                );
              })}
            </div>
            {err("categoryId") && (
              <p className="text-xs text-danger" role="alert">
                {err("categoryId")}
              </p>
            )}
          </fieldset>

          {/* Details grouped in one panel so the form reads as two clear parts. */}
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-muted/50 p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("date")} htmlFor="spentOn" error={err("spentOn")}>
                <Input
                  id="spentOn"
                  name="spentOn"
                  type="date"
                  value={spentOn}
                  onChange={(e) => setSpentOn(e.target.value)}
                  aria-invalid={!!errors.spentOn}
                />
              </Field>
              <Field label={t("paymentMethod")} htmlFor="paymentMethod" error={err("paymentMethod")}>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className={`${inputClass} pr-8`}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {tp(m)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {paymentMethod === "baki" && (
              <p className="-mt-1 flex items-start gap-2 rounded-xl bg-warn/10 px-3 py-2 text-xs text-ink-2">
                <HandCoins className="mt-px size-3.5 shrink-0 text-warn" aria-hidden />
                {t("bakiHint")}
              </p>
            )}

            <Field label={t("note")} htmlFor="note" error={err("note")}>
              <Input
                id="note"
                name="note"
                maxLength={200}
                placeholder={t("notePlaceholder")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </DialogBody>

      <DialogFooter>
        {expense ? (
          <Button type="button" variant="ghost" onClick={remove} loading={deleting} className="text-danger max-sm:flex-1">
            <Trash2 className="size-4" aria-hidden />
            {confirmingDelete ? t("confirmDelete") : t("delete")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={() => submit(true)}
            disabled={pending}
            className="leading-tight max-sm:flex-1 max-sm:px-3"
          >
            {t("saveAndAdd")}
          </Button>
        )}
        <Button type="submit" loading={pending} className="min-w-28 max-sm:flex-1">
          {t("save")}
        </Button>
      </DialogFooter>
    </form>
  );
}
