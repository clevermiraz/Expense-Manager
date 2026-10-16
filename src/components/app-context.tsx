"use client";

import { useTranslations } from "next-intl";
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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

  // The installed app's "Add expense" shortcut opens /dashboard?add=1.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("add") !== "1") return;
    url.searchParams.delete("add");
    window.history.replaceState(null, "", url);
    // One-time read of the launch URL on mount; it can't be known during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    openExpense();
  }, [openExpense]);

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
