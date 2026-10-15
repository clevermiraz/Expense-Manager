"use client";

import { Plus } from "lucide-react";
import { useApp } from "@/components/app-context";
import { buttonClass } from "@/components/ui/button";

export function AddExpenseButton({ label, variant = "primary" }: { label: string; variant?: "primary" | "secondary" }) {
  const { openExpense } = useApp();
  return (
    <button type="button" onClick={() => openExpense()} className={buttonClass(variant, "md")}>
      <Plus className="size-4" aria-hidden />
      {label}
    </button>
  );
}
