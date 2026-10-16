import { CreditCard, Flame, HandCoins, ListChecks, PenLine, Target } from "lucide-react";
import type { Article, Block } from "@/content/learn";

const ICONS = { pen: PenLine, card: CreditCard, handcoins: HandCoins, flame: Flame, list: ListChecks, target: Target } as const;
const TINTS = {
  pen: "bg-primary-soft text-primary",
  card: "bg-violet-500/12 text-violet-600 dark:text-violet-400",
  handcoins: "bg-warn/12 text-warn",
  flame: "bg-orange-500/12 text-orange-600 dark:text-orange-400",
  list: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  target: "bg-sky-500/12 text-sky-600 dark:text-sky-400",
} as const;

export function ArticleIcon({ icon, size = "md" }: { icon: Article["icon"]; size?: "md" | "lg" }) {
  const Icon = ICONS[icon];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl ${TINTS[icon]} ${size === "lg" ? "size-12" : "size-10"}`}
    >
      <Icon className={size === "lg" ? "size-6" : "size-5"} aria-hidden />
    </span>
  );
}

/** Renders an article body: comfortable reading size, short line length. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-4 text-[15px] leading-7 text-ink-2 sm:text-base sm:leading-8">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h":
            return (
              <h2 key={i} className="mt-3 text-lg font-semibold leading-snug text-ink">
                {b.text}
              </h2>
            );
          case "list":
            return (
              <ul key={i} className="flex list-disc flex-col gap-2 pl-5 marker:text-primary">
                {b.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <p key={i} className="rounded-2xl border border-primary/20 bg-primary-soft/60 px-4 py-3 font-medium text-ink">
                {b.text}
              </p>
            );
          default:
            return <p key={i}>{b.text}</p>;
        }
      })}
    </div>
  );
}
