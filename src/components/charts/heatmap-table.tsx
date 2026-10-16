import type { ReactNode } from "react";
import { HorizontalScroller } from "@/components/charts/horizontal-scroller";

// Six-step sequential blue ramp; the steps live in globals.css (--heat-1..6)
// so light and dark mode each get their own validated steps.
const STEPS = 6;

function cellStyle(value: number, max: number) {
  if (value <= 0 || max <= 0) return { background: "transparent", color: "var(--ink-3)" };
  const step = Math.min(STEPS, Math.max(1, Math.ceil((value / max) * STEPS)));
  return { background: `var(--heat-${step})`, color: `var(--heat-ink-${step})` };
}

export type HeatRow = { id: string; label: ReactNode; values: number[]; average: string; total: number };

/** Category x month table; cell shade encodes amount, the number is always printed. */
export function HeatmapTable({
  columns,
  rows,
  format,
  averageLabel,
  categoryLabel,
  caption,
}: {
  columns: { key: string; label: string }[];
  rows: HeatRow[];
  format: (v: number) => string;
  averageLabel: string;
  categoryLabel: string;
  caption: string;
}) {
  const max = Math.max(0, ...rows.flatMap((r) => r.values));
  return (
    // Opens scrolled to the latest month; the category column stays pinned.
    <HorizontalScroller className="-mx-4 px-4 sm:mx-0 sm:px-0">
      <table className="w-full border-separate border-spacing-[2px] text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 z-10 bg-surface px-2 py-2 text-left text-xs font-medium text-ink-3">
              {categoryLabel}
            </th>
            {columns.map((c) => (
              <th key={c.key} scope="col" className="px-2 py-2 text-right text-xs font-medium text-ink-3 whitespace-nowrap">
                {c.label}
              </th>
            ))}
            <th scope="col" className="px-2 py-2 text-right text-xs font-semibold text-ink-2 whitespace-nowrap">
              {averageLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <th
                scope="row"
                className="sticky left-0 z-10 max-w-32 bg-surface px-2 py-1.5 text-left font-medium text-ink whitespace-nowrap sm:max-w-none"
              >
                {r.label}
              </th>
              {r.values.map((v, i) => (
                <td
                  key={columns[i].key}
                  className="rounded-md px-2 py-1.5 text-right text-xs tabular whitespace-nowrap"
                  style={cellStyle(v, max)}
                >
                  {v > 0 ? format(v) : "–"}
                </td>
              ))}
              <td className="px-2 py-1.5 text-right text-xs font-semibold text-ink tabular whitespace-nowrap">{r.average}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </HorizontalScroller>
  );
}
