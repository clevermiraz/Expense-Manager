import type { CSSProperties, ReactNode } from "react";

/**
 * Loading placeholders shaped like each page, shown by the routes'
 * loading.tsx the moment a tab is tapped while the real page renders.
 */
function Bone({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} style={style} />;
}

function Shell({ title, actions, children }: { title: ReactNode; actions?: ReactNode; children: ReactNode }) {
  return (
    <div data-skeleton aria-busy="true">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
          <Bone className="mt-2 h-4 w-44" />
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

function CardBone({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`rounded-3xl border border-line/70 bg-surface p-4 shadow-card sm:p-5 ${className}`}>
      {children ?? (
        <>
          <Bone className="h-5 w-36" />
          <Bone className="mt-2 h-4 w-52" />
          <Bone className="mt-5 h-40 w-full" />
        </>
      )}
    </div>
  );
}

function Rows({ count }: { count: number }) {
  return (
    <div className="flex flex-col divide-y divide-line">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <Bone className="size-9 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <Bone className="h-4 w-2/5" />
            <Bone className="mt-1.5 h-3 w-3/5" />
          </div>
          <Bone className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}

const pill = <Bone className="h-10 w-48 rounded-xl max-sm:w-full" />;

export function DashboardSkeleton({ title }: { title: string }) {
  return (
    <Shell title={title} actions={pill}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="col-span-2 h-32 animate-pulse rounded-3xl bg-linear-to-br from-brand-from/40 to-brand-to/40 lg:col-span-1" />
        <CardBone className="h-28">
          <Bone className="h-4 w-20" />
          <Bone className="mt-3 h-7 w-24" />
        </CardBone>
        <CardBone className="h-28">
          <Bone className="h-4 w-20" />
          <Bone className="mt-3 h-7 w-24" />
        </CardBone>
        <CardBone className="col-span-2 h-28 lg:col-span-1">
          <Bone className="h-4 w-20" />
          <Bone className="mt-3 h-7 w-24" />
        </CardBone>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <CardBone />
        <CardBone>
          <Bone className="mb-5 h-5 w-36" />
          <Rows count={4} />
        </CardBone>
      </div>
    </Shell>
  );
}

export function ExpensesSkeleton({ title }: { title: string }) {
  return (
    <Shell title={title} actions={<Bone className="h-10 w-32 rounded-xl max-sm:hidden" />}>
      <div className="flex gap-2">
        <Bone className="h-11 flex-1" />
        <Bone className="h-11 w-[46%] sm:w-56" />
      </div>
      <div className="mt-2.5 flex gap-1.5 overflow-hidden">
        {[12, 14, 12, 12, 24].map((w, i) => (
          <Bone key={i} className="h-8 shrink-0 rounded-full" style={{ width: `${w * 0.25}rem` }} />
        ))}
      </div>
      <Bone className="mb-3 mt-5 h-4 w-28" />
      <CardBone>
        <Rows count={7} />
      </CardBone>
    </Shell>
  );
}

export function InsightsSkeleton({ title }: { title: string }) {
  return (
    <Shell title={title} actions={<Bone className="h-9 w-56 rounded-xl" />}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <CardBone key={i} className="h-28">
            <Bone className="h-4 w-20" />
            <Bone className="mt-3 h-7 w-24" />
          </CardBone>
        ))}
      </div>
      <CardBone className="mt-4" />
      <CardBone className="mt-4" />
    </Shell>
  );
}

export function BudgetsSkeleton({ title }: { title: string }) {
  return (
    <Shell title={title}>
      <CardBone className="h-16">
        <Bone className="h-4 w-3/4" />
      </CardBone>
      <CardBone className="mt-4">
        <Bone className="h-5 w-36" />
        <Bone className="mt-5 h-10 w-full" />
      </CardBone>
      <CardBone className="mt-4">
        <Bone className="mb-5 h-5 w-36" />
        <Rows count={5} />
      </CardBone>
    </Shell>
  );
}

export function SettingsSkeleton({ title }: { title: string }) {
  return (
    <Shell title={title}>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <CardBone key={i}>
            <Bone className="h-5 w-36" />
            <Bone className="mt-2 h-4 w-52" />
            <Bone className="mt-5 h-11 w-full" />
          </CardBone>
        ))}
      </div>
    </Shell>
  );
}
