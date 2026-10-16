import type { ReactNode } from "react";

export function StatTile({
  label,
  value,
  footer,
  testId,
  tone = "default",
  className = "",
}: {
  label: ReactNode;
  value: ReactNode;
  footer?: ReactNode;
  testId?: string;
  /** "hero" is the headline number: brand gradient, bigger type. */
  tone?: "default" | "hero";
  className?: string;
}) {
  const hero = tone === "hero";
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-4 ${
        hero
          ? "bg-linear-to-br from-brand-from to-brand-to text-white shadow-lg shadow-primary/25"
          : "border border-line/70 bg-surface shadow-card"
      } ${className}`}
      data-testid={testId}
    >
      {hero && (
        // soft decorative glow
        <span aria-hidden className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-white/10 blur-2xl" />
      )}
      <p className={`text-sm ${hero ? "text-white/80" : "text-ink-3"}`}>{label}</p>
      <p
        className={`mt-1 font-semibold tracking-tight tabular ${hero ? "text-4xl lg:text-3xl" : "text-2xl text-ink"}`}
        data-testid={testId ? `${testId}-value` : undefined}
      >
        {value}
      </p>
      {footer && <div className={`mt-1.5 text-xs ${hero ? "text-white/85" : "text-ink-3"}`}>{footer}</div>}
    </div>
  );
}
