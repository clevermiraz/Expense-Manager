"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";

type Toast = { id: number; kind: "success" | "error"; message: string };
let listeners: ((t: Toast) => void)[] = [];
let nextId = 1;

export function toast(message: string, kind: Toast["kind"] = "success") {
  const t = { id: nextId++, kind, message };
  listeners.forEach((l) => l(t));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
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
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+6.5rem)] z-50 flex flex-col items-center gap-2 px-4 md:bottom-6"
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
