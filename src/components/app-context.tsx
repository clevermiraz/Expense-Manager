"use client";

import { useTranslations } from "next-intl";
import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import type { Category, ExpenseRow } from "@/lib/data";
import { ExpenseDialog } from "@/components/expense-dialog";
import { Toaster } from "@/components/ui/toast";

type AppData = { categories: Category[]; currency: string; today: string };
type AppContextValue = AppData & {
  categoryById: Map<string, Category>;
  openExpense: (expense?: ExpenseRow | null, defaults?: { spentOn?: string; categoryId?: string }) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ data, children }: { data: AppData; children: ReactNode }) {
  const [dialog, setDialog] = useState<{
    open: boolean;
    expense: ExpenseRow | null;
    defaults?: { spentOn?: string; categoryId?: string };
  }>({ open: false, expense: null });

  const openExpense = useCallback<AppContextValue["openExpense"]>((expense, defaults) => {
    setDialog({ open: true, expense: expense ?? null, defaults });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({ ...data, categoryById: new Map(data.categories.map((c) => [c.id, c])), openExpense }),
    [data, openExpense],
  );

  return (
    <AppContext value={value}>
      {children}
      <ExpenseDialog
        open={dialog.open}
        expense={dialog.expense}
        defaults={dialog.defaults}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
      />
      <Toaster />
    </AppContext>
  );
}

export function useApp() {
  const ctx = use(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

/** Built-in categories are translated; custom ones show their own name. */
export function useCategoryLabel() {
  const t = useTranslations("categories");
  return useCallback(
    (c: Pick<Category, "key" | "name"> | undefined) => (c ? (c.key ? t(c.key) : (c.name ?? "")) : ""),
    [t],
  );
}
