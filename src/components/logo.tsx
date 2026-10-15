import { Wallet } from "lucide-react";

export function Logo({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-semibold text-ink">
      <span className="inline-flex size-8 items-center justify-center rounded-xl bg-primary text-white">
        <Wallet className="size-4.5" aria-hidden />
      </span>
      {name}
    </span>
  );
}
