import { Wallet } from "lucide-react";

export function Logo({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-semibold text-ink">
      <span className="inline-flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-brand-from to-brand-to text-white shadow-sm shadow-primary/30">
        <Wallet className="size-4.5" aria-hidden />
      </span>
      {name}
    </span>
  );
}
