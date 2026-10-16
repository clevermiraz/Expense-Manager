"use client";

import { CalendarDays, Delete, HandCoins, Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useApp, useCategoryLabel, useCurrencySymbol } from "@/components/app-context";
import { CategoryIcon } from "@/components/category-icon";
import { useExpenseDraft, type ExpenseDefaults } from "@/components/expense-draft";
import { Button } from "@/components/ui/button";
import { DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/field";
import type { ExpenseRow } from "@/lib/data";
import { PAYMENT_METHODS } from "@/lib/default-categories";
import { formatDay, formatNumber } from "@/lib/format";
import { localizeDigits } from "@/lib/numbers";

type Step = 1 | 2 | 3;
const STEPS = 3;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"] as const;
type Key = (typeof KEYS)[number];

/** Applies one keypad press to the typed amount (max 9 digits, 2 decimals). */
export function applyKey(prev: string, key: Key): string {
  if (key === "back") return prev.slice(0, -1);
  if (key === ".") return prev.includes(".") ? prev : `${prev || "0"}.`;
  const [int, dec] = prev.split(".");
  if (dec !== undefined) return dec.length >= 2 ? prev : prev + key;
  if (int === "0") return key;
  return int.length >= 9 ? prev : prev + key;
}

/** "125000.5" → "১,২৫,০০০.৫" while typing: grouped, with the decimals kept as typed. */
function displayAmount(raw: string, locale: string): string {
  if (!raw) return "";
  const [int, dec] = raw.split(".");
  const grouped = formatNumber(Number(int || "0"), locale);
  return dec === undefined ? grouped : `${grouped}.${localizeDigits(dec, locale)}`;
}

function shiftDay(day: string, delta: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10);
}

/**
 * Phone "add expense" sheet in three short steps: amount (on its own keypad,
 * so the phone keyboard never covers the sheet), category, then the optional
 * details and Save. Editing opens on the last step, with amount and category
 * one tap away.
 */
export function ExpenseWizard({
  expense,
  defaults,
  onDone,
}: {
  expense: ExpenseRow | null;
  defaults?: ExpenseDefaults;
  onDone: () => void;
}) {
  const t = useTranslations("expenseForm");
  const tc = useTranslations("common");
  const tp = useTranslations("paymentMethods");
  const locale = useLocale();
  const { categories, categoryById, currency, today } = useApp();
  const label = useCategoryLabel();
  const symbol = useCurrencySymbol();
  const draft = useExpenseDraft(expense, defaults, onDone, { preselectCategory: false });
  const { amount, setAmount, categoryId, setCategoryId, spentOn, setSpentOn, paymentMethod, setPaymentMethod } = draft;

  const [step, setStep] = useState<Step>(expense ? 3 : 1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  // After the details step has been seen once, the earlier steps return straight to it.
  const [reviewed, setReviewed] = useState(!!expense);
  const stepRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  function go(to: Step) {
    setDirection(to > step ? "next" : "back");
    if (to === 3) setReviewed(true);
    setStep(to);
  }

  // Keep focus inside the sheet when the step's buttons are swapped out.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepRef.current?.focus({ preventScroll: true });
  }, [step]);

  function continueFromAmount() {
    const error = draft.checkAmount();
    if (error) return draft.setErrors({ amount: error });
    draft.setErrors({});
    go(reviewed && categoryId ? 3 : 2);
  }

  function press(key: Key) {
    if (draft.errors.amount) draft.setErrors({});
    setAmount((prev) => applyKey(prev, key));
  }

  // A real keyboard works on the keypad step too (tablets, desktop testing).
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return;
    const digit = "০১২৩৪৫৬৭৮৯".indexOf(e.key);
    const key: Key | null =
      digit >= 0
        ? (String(digit) as Key)
        : /^[0-9]$/.test(e.key)
          ? (e.key as Key)
          : e.key === "." || e.key === ","
            ? "."
            : e.key === "Backspace"
              ? "back"
              : null;
    if (key) {
      e.preventDefault();
      press(key);
    } else if (e.key === "Enter") {
      e.preventDefault();
      continueFromAmount();
    }
  });
  useEffect(() => {
    if (step !== 1) return;
    const handler = (e: KeyboardEvent) => onKeyDown(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step]);

  // Long-press on ⌫ clears the whole amount.
  const holdTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const held = useRef(false);

  function pickCategory(id: string) {
    setCategoryId(id);
    if (draft.errors.categoryId) draft.setErrors({});
    // A short beat so the tap visibly lands before the next step slides in.
    setTimeout(() => go(3), 120);
  }

  function save(addAnother: boolean) {
    draft.submit(addAnother, {
      onInvalid: (fields) => {
        if (fields.amount) go(1);
        else if (fields.categoryId) go(2);
      },
      onAddAnother: () => {
        setReviewed(false);
        go(1);
      },
    });
  }

  const shown = displayAmount(amount, locale);
  const category = categoryById.get(categoryId);
  const yesterday = shiftDay(today, -1);
  const otherDay = spentOn !== today && spentOn !== yesterday;
  const n = (v: number) => formatNumber(v, locale);
  const stepName = [t("stepAmount"), t("stepCategory"), t("stepDetails")][step - 1];

  // Editing: steps 1–2 are detours from the summary, so "back" returns to it.
  const onBack = expense ? (step !== 3 ? () => go(3) : undefined) : step > 1 ? () => go((step - 1) as Step) : undefined;

  const chip = (active: boolean) =>
    `inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors cursor-pointer ${
      active ? "border-primary bg-primary text-white shadow-sm shadow-primary/25" : "border-line bg-surface text-ink-2 hover:bg-muted"
    }`;

  return (
    <div className="flex h-[min(calc(var(--vvh,100dvh)*0.92),42rem)] flex-col">
      <DialogHeader
        title={expense ? t("editTitle") : t("addTitle")}
        subtitle={expense ? undefined : t("stepOf", { step: n(step), total: n(STEPS), name: stepName })}
        onClose={onDone}
        closeLabel={tc("close")}
        onBack={onBack}
        backLabel={t("back")}
      >
        {!expense && (
          <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden>
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-primary" : "bg-line"}`}
              />
            ))}
          </div>
        )}
      </DialogHeader>

      <div
        ref={stepRef}
        tabIndex={-1}
        key={step}
        className={`flex min-h-0 flex-1 flex-col outline-none ${direction === "next" ? "step-next" : "step-back"}`}
      >
        {step === 1 && (
          <>
            <div className="flex min-h-0 flex-1 flex-col px-5">
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-3">
                <p className="text-sm font-medium text-ink-2">{t("amountPrompt")}</p>
                <output
                  aria-label={t("amount", { currency })}
                  aria-live="polite"
                  data-testid="amount-display"
                  className={`flex max-w-full items-baseline gap-1.5 font-semibold tracking-tight tabular ${
                    shown.length > 11 ? "text-3xl" : shown.length > 8 ? "text-4xl" : "text-5xl"
                  }`}
                >
                  <span className="text-[0.6em] text-ink-3">{symbol}</span>
                  <span className={`truncate ${shown ? "text-ink" : "text-ink-3"}`}>{shown || localizeDigits("0", locale)}</span>
                  <span className="caret h-[0.9em] w-0.5 self-center rounded-full bg-primary" aria-hidden />
                </output>
                <p className="min-h-4 text-xs text-danger" role="alert">
                  {draft.err("amount")}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-3">
                {KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      // The long-press already cleared the amount.
                      if (held.current) held.current = false;
                      else press(key);
                    }}
                    onPointerDown={
                      key === "back"
                        ? () => {
                            held.current = false;
                            holdTimer.current = setTimeout(() => {
                              held.current = true;
                              setAmount("");
                            }, 450);
                          }
                        : undefined
                    }
                    onPointerUp={key === "back" ? () => clearTimeout(holdTimer.current) : undefined}
                    onPointerLeave={key === "back" ? () => clearTimeout(holdTimer.current) : undefined}
                    aria-label={key === "back" ? t("backspace") : key === "." ? t("decimalPoint") : undefined}
                    className="flex h-14 select-none items-center justify-center rounded-2xl bg-muted text-2xl font-medium text-ink transition-[background-color,transform] duration-100 touch-manipulation active:scale-95 active:bg-line cursor-pointer"
                  >
                    {key === "back" ? <Delete className="size-6" aria-hidden /> : localizeDigits(key, locale)}
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={continueFromAmount} className="h-12 flex-1 rounded-2xl text-base sm:h-12">
                {reviewed && categoryId ? t("done") : t("next")}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <DialogBody>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t("changeAmount")}
              className="mx-auto mb-4 flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-base font-semibold tabular text-ink cursor-pointer"
            >
              <span className="text-ink-3">{symbol}</span>
              {shown}
              <Pencil className="size-3.5 text-ink-3" aria-hidden />
            </button>
            <p id="category-prompt" className="mb-3 text-center text-sm font-medium text-ink-2">
              {t("categoryPrompt")}
            </p>
            <div role="radiogroup" aria-labelledby="category-prompt" className="grid grid-cols-4 gap-2">
              {categories.map((c) => {
                const active = c.id === categoryId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => pickCategory(c.id)}
                    className={`flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border px-1 py-3 text-[11px] leading-tight transition-[color,background-color,transform] active:scale-95 cursor-pointer ${
                      active
                        ? "border-primary bg-primary-soft font-medium text-ink ring-1 ring-primary"
                        : "border-line text-ink-2 hover:bg-muted"
                    }`}
                  >
                    <CategoryIcon icon={c.icon} color={c.color} />
                    <span className="line-clamp-2 w-full text-center break-words">{label(c)}</span>
                  </button>
                );
              })}
            </div>
            {draft.err("categoryId") && (
              <p className="mt-2 text-xs text-danger" role="alert">
                {draft.err("categoryId")}
              </p>
            )}
          </DialogBody>
        )}

        {step === 3 && (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              save(false);
            }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <DialogBody>
              <div className="flex flex-col gap-5">
                {/* What was entered so far; each half jumps back to its step. */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={t("changeAmount")}
                    className="relative flex min-w-0 flex-col items-start gap-0.5 rounded-2xl border border-line bg-muted/50 p-3 text-left hover:bg-muted cursor-pointer"
                  >
                    <span className="text-xs text-ink-3">{t("stepAmount")}</span>
                    <span className="max-w-full truncate text-xl font-semibold tabular text-ink">
                      <span className="text-ink-3">{symbol}</span>
                      {shown}
                    </span>
                    <Pencil className="absolute right-3 top-3 size-3.5 text-ink-3" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(2)}
                    aria-label={t("changeCategory")}
                    className="relative flex min-w-0 flex-col items-start gap-1 rounded-2xl border border-line bg-muted/50 p-3 text-left hover:bg-muted cursor-pointer"
                  >
                    <span className="text-xs text-ink-3">{t("category")}</span>
                    <span className="flex max-w-full items-center gap-2 text-sm font-medium text-ink">
                      {category && <CategoryIcon icon={category.icon} color={category.color} size="sm" />}
                      <span className="truncate">{label(category)}</span>
                    </span>
                    <Pencil className="absolute right-3 top-3 size-3.5 text-ink-3" aria-hidden />
                  </button>
                </div>

                <Field
                  label={
                    <>
                      {t("note")} <span className="font-normal text-ink-3">({t("optional")})</span>
                    </>
                  }
                  htmlFor="note"
                  error={draft.err("note")}
                >
                  <Input
                    id="note"
                    name="note"
                    maxLength={200}
                    autoComplete="off"
                    enterKeyHint="done"
                    placeholder={t("notePlaceholder")}
                    value={draft.note}
                    onChange={(e) => draft.setNote(e.target.value)}
                  />
                </Field>

                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-medium text-ink-2">{t("date")}</legend>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" aria-pressed={spentOn === today} onClick={() => setSpentOn(today)} className={chip(spentOn === today)}>
                      {t("today")}
                    </button>
                    <button
                      type="button"
                      aria-pressed={spentOn === yesterday}
                      onClick={() => setSpentOn(yesterday)}
                      className={chip(spentOn === yesterday)}
                    >
                      {t("yesterday")}
                    </button>
                    {/* The native date picker sits invisibly on top, so a tap opens it. */}
                    <label className={`relative ${chip(otherDay)}`}>
                      <CalendarDays className="size-4" aria-hidden />
                      {otherDay ? formatDay(spentOn, locale, { day: "numeric", month: "short", year: "numeric" }) : t("otherDay")}
                      <input
                        type="date"
                        aria-label={t("date")}
                        value={spentOn}
                        onChange={(e) => e.target.value && setSpentOn(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </label>
                  </div>
                  {draft.err("spentOn") && (
                    <p className="text-xs text-danger" role="alert">
                      {draft.err("spentOn")}
                    </p>
                  )}
                </fieldset>

                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-medium text-ink-2">{t("paymentMethod")}</legend>
                  <div role="radiogroup" aria-label={t("paymentMethod")} className="flex flex-wrap gap-2">
                    {PAYMENT_METHODS.map((m) => {
                      const active = paymentMethod === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setPaymentMethod(m)}
                          className={
                            m === "baki" && active
                              ? "inline-flex h-10 items-center gap-1.5 rounded-full border border-warn bg-warn px-4 text-sm font-medium text-white shadow-sm cursor-pointer"
                              : chip(active)
                          }
                        >
                          {m === "baki" && <HandCoins className="size-4" aria-hidden />}
                          {tp(m)}
                        </button>
                      );
                    })}
                  </div>
                  {paymentMethod === "baki" && (
                    <p className="flex items-start gap-2 rounded-xl bg-warn/10 px-3 py-2 text-xs text-ink-2">
                      <HandCoins className="mt-px size-3.5 shrink-0 text-warn" aria-hidden />
                      {t("bakiHint")}
                    </p>
                  )}
                </fieldset>
              </div>
            </DialogBody>

            <DialogFooter>
              {expense ? (
                <Button type="button" variant="ghost" onClick={draft.remove} loading={draft.deleting} className="flex-1 text-danger">
                  <Trash2 className="size-4" aria-hidden />
                  {draft.confirmingDelete ? t("confirmDelete") : t("delete")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => save(true)}
                  disabled={draft.pending}
                  className="h-12 flex-1 rounded-2xl px-3 leading-tight sm:h-12"
                >
                  {t("saveAndAdd")}
                </Button>
              )}
              <Button type="submit" loading={draft.pending} className="h-12 flex-1 rounded-2xl text-base sm:h-12">
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </div>
    </div>
  );
}
