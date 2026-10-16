"use client";

import { useLocale } from "next-intl";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type YAxisTickContentProps } from "recharts";
import { formatCompact, formatMoney } from "@/lib/format";

export type BarDatum = { key: string; tick: string; label: string; value: number; muted?: boolean };

/**
 * Single-series bar chart (one color, slot 1). Hover shows the exact value;
 * the y axis uses compact ticks. `muted` bars (e.g. a partial month)
 * render at reduced opacity.
 */
export function SpendBarChart({
  data,
  currency,
  height = 220,
  ariaLabel,
}: {
  data: BarDatum[];
  currency: string;
  height?: number;
  ariaLabel: string;
}) {
  const locale = useLocale();
  const tick = (v: number) => formatCompact(v, locale);
  // Room for the longest y-axis label (the top tick can round above the
  // max, e.g. 1,086 → "১.২ হাজার"); labels are never wrapped onto two lines.
  const max = Math.max(0, ...data.map((d) => d.value));
  const longest = Math.max(tick(max).length, tick(max * 1.25).length);
  const axisWidth = Math.min(96, Math.max(36, Math.round(longest * (locale === "bn" ? 7 : 6.5) + 12)));
  return (
    <div role="img" aria-label={ariaLabel} style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barCategoryGap="18%">
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeWidth={1} />
          <XAxis
            dataKey="tick"
            tickLine={false}
            axisLine={{ stroke: "var(--chart-grid)" }}
            tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
            interval="preserveStartEnd"
            minTickGap={6}
          />
          <YAxis
            width={axisWidth}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            // Plain <text>: Recharts' default tick wraps at spaces ("১.২ / হাজার").
            tick={({ x, y, payload }: YAxisTickContentProps) => (
              <text x={x} y={y} dy={4} textAnchor="end" fill="var(--chart-axis)" fontSize={11}>
                {tick(Number(payload.value))}
              </text>
            )}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as BarDatum;
              return (
                <div className="rounded-xl border border-line bg-surface px-3 py-2 text-xs shadow-lg">
                  <p className="text-ink-3">{d.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink tabular">{formatMoney(d.value, currency, locale)}</p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="value"
            fill="var(--chart-1)"
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
            isAnimationActive={false}
            shape={(props: unknown) => {
              const p = props as { x: number; y: number; width: number; height: number; payload: BarDatum };
              if (!p.height || p.height <= 0) return <g />;
              const r = Math.min(4, p.width / 2, p.height);
              const { x, y, width: w, height: h } = p;
              return (
                <path
                  d={`M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`}
                  fill="var(--chart-1)"
                  fillOpacity={p.payload.muted ? 0.45 : 1}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
