"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useImperativeHandle, useRef, useState, type Ref } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field";

export type NoteComposerHandle = { open: () => void };

/**
 * Small note editor pinned to the TOP of the screen, over the add sheet, so
 * the phone keyboard never covers what you're typing. Enter (or the
 * keyboard's ✓) means "done": it keeps the note and closes, it doesn't save
 * the expense. Tapping outside keeps the text too.
 */
export function NoteComposer({
  ref,
  value,
  suggestions,
  onDone,
}: {
  ref: Ref<NoteComposerHandle>;
  value: string;
  suggestions: string[];
  onDone: (note: string) => void;
}) {
  const t = useTranslations("expenseForm");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(value);

  useImperativeHandle(ref, () => ({
    // Called straight from the tap, so iOS treats the focus as user-initiated
    // and actually opens the keyboard.
    open() {
      const dialog = dialogRef.current;
      const input = inputRef.current;
      if (!dialog || !input || dialog.open) return;
      setText(value);
      input.value = value;
      dialog.showModal();
      input.focus();
      input.setSelectionRange(value.length, value.length);
    },
  }));

  function done(note: string) {
    onDone(note.trim());
    dialogRef.current?.close();
  }

  const typed = text.trim().toLowerCase();
  const matches = suggestions.filter((s) => s !== text.trim() && (!typed || s.toLowerCase().includes(typed)));

  if (typeof document === "undefined") return null;
  // Portalled to <body>: outside the expense <form>, so Enter here can't submit it.
  return createPortal(
    <dialog
      ref={dialogRef}
      aria-label={t("note")}
      // close/cancel don't bubble to the add sheet underneath (React would
      // otherwise pass them up through the portal and close it too).
      onClose={(e) => e.stopPropagation()}
      onCancel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        done(text);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === dialogRef.current) done(text);
      }}
      className="note-composer mx-auto mb-auto mt-[calc(env(safe-area-inset-top)+0.75rem)] w-[calc(100%-1.5rem)] max-w-md rounded-3xl border border-line bg-surface p-4 text-ink shadow-float backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          done(text);
        }}
        className="flex flex-col gap-3"
      >
        <label htmlFor="note-composer" className="text-sm font-medium text-ink-2">
          {t("note")} <span className="font-normal text-ink-3">({t("optional")})</span>
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="note-composer"
            maxLength={200}
            autoComplete="off"
            enterKeyHint="done"
            placeholder={t("notePlaceholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`${inputClass} h-12 pr-11`}
          />
          {text && (
            <button
              type="button"
              aria-label={t("clearNote")}
              onClick={() => {
                setText("");
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 hover:bg-muted cursor-pointer"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        {matches.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-ink-3">{t("recentNotes")}</p>
            <div className="flex flex-wrap gap-1.5">
              {matches.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => done(s)}
                  className="max-w-full truncate rounded-full border border-line bg-muted/60 px-3 py-1.5 text-sm text-ink hover:bg-muted cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <Button type="submit" className="h-11 rounded-2xl text-base">
          {t("done")}
        </Button>
      </form>
    </dialog>,
    document.body,
  );
}
