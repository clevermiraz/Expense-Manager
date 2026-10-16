"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/** Native <dialog> modal: focus trap, Esc to close and backdrop come for free. */
export function Dialog({
  open,
  onClose,
  title,
  children,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  closeLabel: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="sheet m-auto w-[calc(100%-1.5rem)] max-w-lg rounded-3xl border border-line bg-surface p-0 text-ink shadow-float backdrop:bg-black/40 backdrop:backdrop-blur-[2px] max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0"
    >
      {open && (
        <div className="max-h-[92dvh] overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 max-sm:pt-2">
          {/* grab handle: a visual cue that this is a bottom sheet on phones */}
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden />
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="rounded-xl p-1.5 text-ink-3 hover:bg-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
