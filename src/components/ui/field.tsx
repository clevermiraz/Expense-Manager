import type { ComponentProps, ReactNode } from "react";

export const inputClass =
  "h-11 w-full rounded-xl border border-line bg-surface px-3 text-base text-ink sm:h-10 sm:text-sm placeholder:text-ink-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 aria-[invalid=true]:border-danger disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: ReactNode;
  htmlFor?: string;
  error?: string | null;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink-2">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input className={`${inputClass} ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }: ComponentProps<"select">) {
  return (
    <select className={`${inputClass} pr-8 ${className}`} {...props}>
      {children}
    </select>
  );
}
