"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Toast = { id: number; kind: "success" | "error"; message: string };
let listeners: ((t: Toast) => void)[] = [];
let nextId = 1;

export function toast(message: string, kind: Toast["kind"] = "success") {
  const t = { id: nextId++, kind, message };
  listeners.forEach((l) => l(t));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Modal <dialog>s live in the browser's top layer, above any z-index. Showing
  // the toasts as a popover puts them in the top layer too; re-showing on each
  // new toast keeps them above a dialog that opened after them.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.showPopover !== "function") return;
    if (el.matches(":popover-open")) el.hidePopover();
    if (items.length > 0) el.showPopover();
  }, [items]);
  useEffect(() => {
    const add = (t: Toast) => {
      setItems((cur) => [...cur.slice(-1), t]);
      setTimeout(() => setItems((cur) => cur.filter((x) => x.id !== t.id)), 3500);
    };
    listeners.push(add);
    return () => {
      listeners = listeners.filter((l) => l !== add);
    };
  }, []);

  return (
    <div
      ref={ref}
      popover="manual"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-auto bottom-[calc(env(safe-area-inset-bottom)+6.5rem)] z-50 m-0 h-auto w-full flex-col items-center gap-2 overflow-visible border-0 bg-transparent p-0 px-4 md:bottom-6 [&:popover-open]:flex"
    >
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className="toast-in pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-float"
        >
          {t.kind === "success" ? (
            <CircleCheck className="size-4 text-good" aria-hidden />
          ) : (
            <CircleAlert className="size-4 text-danger" aria-hidden />
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
