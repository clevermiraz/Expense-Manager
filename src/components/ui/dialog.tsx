"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Native <dialog> modal: focus trap, Esc to close and backdrop come for free.
 * Layout is header / DialogBody (scrolls) / optional DialogFooter (pinned), so
 * fields never slide underneath the action buttons.
 */
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
    if (open && !el.open) {
      el.showModal();
      // showModal() focuses the first button (close); move focus to the field
      // the content asked for instead.
      el.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
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
      className="sheet m-auto w-[calc(100%-1.5rem)] max-w-lg overflow-hidden rounded-3xl border border-line bg-surface p-0 text-ink shadow-float backdrop:bg-black/40 backdrop:backdrop-blur-[2px] max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0"
    >
      {open && (
        <div className="flex max-h-[min(92dvh,46rem)] flex-col">
          <div className="shrink-0 px-5 pb-3 pt-5 max-sm:pt-2">
            {/* grab handle: a visual cue that this is a bottom sheet on phones */}
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden />
            <div className="flex items-center justify-between gap-3">
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
          </div>
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      )}
    </dialog>
  );
}

/** Scrolling content area; shows soft edge shadows while there's more to scroll. */
export function DialogBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`scroll-shadows min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1 ${className}`}
    >
      {children}
    </div>
  );
}

/** Action bar pinned below the scrolling body. */
export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-line bg-surface px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:justify-between">
      {children}
    </div>
  );
}
