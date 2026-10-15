import type { ReactNode } from "react";

export type RankedRow = {
  id: string;
  label: string;
  leading?: ReactNode;
  value: number;
  valueLabel: string;
  detail?: string;
};

/** Horizontal ranked bars in one color; the value is printed, so no hover is needed. */
export function RankedBars({ rows, max }: { rows: RankedRow[]; max?: number }) {
  const top = max ?? Math.max(...rows.map((r) => r.value), 0);
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((r) => (
        <li key={r.id} className="flex items-center gap-3">
          {r.leading}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="truncate font-medium text-ink">{r.label}</span>
              <span className="shrink-0 font-semibold text-ink tabular">{r.valueLabel}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[var(--chart-1)]"
                  style={{ width: `${top > 0 ? Math.max(2, (r.value / top) * 100) : 0}%` }}
                />
              </div>
              {r.detail && <span className="w-10 shrink-0 text-right text-xs text-ink-3 tabular">{r.detail}</span>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
