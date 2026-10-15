import {
  Baby,
  BookOpen,
  Briefcase,
  Bus,
  Car,
  Clapperboard,
  Coffee,
  Dog,
  Dumbbell,
  Fuel,
  Gift,
  GraduationCap,
  HandCoins,
  HeartPulse,
  House,
  Landmark,
  Pill,
  PiggyBank,
  Plane,
  Receipt,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Tag,
  Users,
  Utensils,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  "shopping-basket": ShoppingBasket,
  bus: Bus,
  home: House,
  zap: Zap,
  smartphone: Smartphone,
  "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  clapperboard: Clapperboard,
  users: Users,
  plane: Plane,
  gift: Gift,
  tag: Tag,
  coffee: Coffee,
  car: Car,
  fuel: Fuel,
  shirt: Shirt,
  baby: Baby,
  dog: Dog,
  dumbbell: Dumbbell,
  wifi: Wifi,
  book: BookOpen,
  briefcase: Briefcase,
  landmark: Landmark,
  wrench: Wrench,
  pill: Pill,
  sparkles: Sparkles,
  "hand-coins": HandCoins,
  "piggy-bank": PiggyBank,
  receipt: Receipt,
};

export const CATEGORY_COLORS = [
  "#f97316", "#16a34a", "#0ea5e9", "#8b5cf6", "#eab308", "#06b6d4", "#ec4899",
  "#ef4444", "#6366f1", "#a855f7", "#14b8a6", "#3b82f6", "#f43f5e", "#64748b",
];

export function CategoryIcon({
  icon,
  color,
  size = "md",
}: {
  icon: string;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = CATEGORY_ICONS[icon] ?? Tag;
  const box = size === "sm" ? "size-7" : size === "lg" ? "size-11" : "size-9";
  const glyph = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";
  return (
    <span
      aria-hidden
      className={`${box} inline-flex shrink-0 items-center justify-center rounded-xl`}
      style={{ backgroundColor: `${color}1f`, color }}
    >
      <Icon className={glyph} strokeWidth={2.2} />
    </span>
  );
}
