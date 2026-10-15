import type { ReactNode } from "react";

export function StatTile({
  label,
  value,
  footer,
  testId,
}: {
  label: ReactNode;
  value: ReactNode;
  footer?: ReactNode;
  testId?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4" data-testid={testId}>
      <p className="text-sm text-ink-3">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink" data-testid={testId ? `${testId}-value` : undefined}>
        {value}
      </p>
      {footer && <div className="mt-1.5 text-xs text-ink-3">{footer}</div>}
    </div>
  );
}
