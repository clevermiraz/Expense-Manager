import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";

export type BudgetState = "ok" | "warning" | "over";

export function budgetState(spent: number, limit: number): BudgetState {
  if (spent > limit) return "over";
  if (spent >= limit * 0.8) return "warning";
  return "ok";
}

const STYLES: Record<BudgetState, { bar: string; text: string; Icon: typeof CircleCheck }> = {
  ok: { bar: "bg-good", text: "text-good", Icon: CircleCheck },
  warning: { bar: "bg-warn", text: "text-warn", Icon: TriangleAlert },
  over: { bar: "bg-danger", text: "text-danger", Icon: CircleAlert },
};

/** Status meter: color is always paired with an icon and a text label. */
export function BudgetMeter({
  spent,
  limit,
  statusLabel,
  marker,
}: {
  spent: number;
  limit: number;
  statusLabel: string;
  /** Optional 0..1 position for "where you should be today" pacing tick. */
  marker?: number;
}) {
  const state = budgetState(spent, limit);
  const s = STYLES[state];
  const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  return (
    <div>
      <div
        className="relative h-2 overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(spent, limit)}
        aria-label={statusLabel}
      >
        <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${pct}%` }} />
        {marker !== undefined && marker > 0 && marker < 1 && (
          <div className="absolute inset-y-0 w-0.5 bg-ink/40" style={{ left: `${marker * 100}%` }} aria-hidden />
        )}
      </div>
      <p className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${s.text}`}>
        <s.Icon className="size-3.5" aria-hidden />
        {statusLabel}
      </p>
    </div>
  );
}
