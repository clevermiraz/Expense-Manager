"use client";

import { ArrowLeft, X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Native <dialog> modal: focus trap, Esc to close and backdrop come for free.
 * Layout is header / DialogBody (scrolls) / optional DialogFooter (pinned), so
 * fields never slide underneath the action buttons.
 *
 * Pass `title` for the standard header, or leave it out and render a
 * <DialogHeader> yourself (e.g. one with a back button).
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
  title?: ReactNode;
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

  // Phones: an on-screen keyboard shrinks only the *visual* viewport, so a
  // sheet pinned to the bottom would sit behind it. Lift the sheet by the
  // keyboard's height and cap it to the space that is left.
  useEffect(() => {
    const el = ref.current;
    const vv = window.visualViewport;
    if (!open || !el || !vv) return;
    const sync = () => {
      // Only when typing inside this sheet: a note box opened on top of it
      // brings up the keyboard too, and the sheet behind should stay put.
      const typingHere = el.contains(document.activeElement);
      const keyboard = typingHere ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;
      el.style.setProperty("--kb", `${Math.round(keyboard)}px`);
      el.style.setProperty("--vvh", `${Math.round(vv.height)}px`);
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
    };
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
      className="sheet m-auto w-[calc(100%-1.5rem)] max-w-lg overflow-hidden rounded-3xl border border-line bg-surface p-0 text-ink shadow-float backdrop:bg-black/40 backdrop:backdrop-blur-[2px] max-sm:mb-(--kb,0px) max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0"
    >
      {open && (
        <div className="flex max-h-[min(calc(var(--vvh,100dvh)*0.92),46rem)] flex-col">
          {title !== undefined && <DialogHeader title={title} onClose={onClose} closeLabel={closeLabel} />}
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      )}
    </dialog>
  );
}

export function DialogHeader({
  title,
  subtitle,
  onClose,
  closeLabel,
  onBack,
  backLabel,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  closeLabel: string;
  /** Shows a back arrow before the title (multi-step sheets). */
  onBack?: () => void;
  backLabel?: string;
  /** Extra content under the title row, e.g. a progress bar. */
  children?: ReactNode;
}) {
  const iconButton =
    "rounded-xl p-1.5 text-ink-3 hover:bg-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer";
  return (
    <div className="shrink-0 px-5 pb-3 pt-5 max-sm:pt-2">
      {/* grab handle: a visual cue that this is a bottom sheet on phones */}
      <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden />
      <div className="flex items-center gap-2">
        {onBack && (
          <button type="button" onClick={onBack} aria-label={backLabel} className={`-ml-1.5 ${iconButton}`}>
            <ArrowLeft className="size-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-xs text-ink-3">{subtitle}</p>}
        </div>
        <button type="button" onClick={onClose} aria-label={closeLabel} className={iconButton}>
          <X className="size-5" />
        </button>
      </div>
      {children}
    </div>
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
export function DialogFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center gap-2 border-t border-line bg-surface px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:justify-between ${className}`}
    >
      {children}
    </div>
  );
}
