export type CategoryKey =
  | "food"
  | "groceries"
  | "transport"
  | "rent"
  | "utilities"
  | "mobile"
  | "shopping"
  | "health"
  | "education"
  | "entertainment"
  | "family"
  | "travel"
  | "gifts"
  | "other";

export const DEFAULT_CATEGORIES: { key: CategoryKey; icon: string; color: string }[] = [
  { key: "food", icon: "utensils", color: "#f97316" },
  { key: "groceries", icon: "shopping-basket", color: "#16a34a" },
  { key: "transport", icon: "bus", color: "#0ea5e9" },
  { key: "rent", icon: "home", color: "#8b5cf6" },
  { key: "utilities", icon: "zap", color: "#eab308" },
  { key: "mobile", icon: "smartphone", color: "#06b6d4" },
  { key: "shopping", icon: "shopping-bag", color: "#ec4899" },
  { key: "health", icon: "heart-pulse", color: "#ef4444" },
  { key: "education", icon: "graduation-cap", color: "#6366f1" },
  { key: "entertainment", icon: "clapperboard", color: "#a855f7" },
  { key: "family", icon: "users", color: "#14b8a6" },
  { key: "travel", icon: "plane", color: "#3b82f6" },
  { key: "gifts", icon: "gift", color: "#f43f5e" },
  { key: "other", icon: "tag", color: "#64748b" },
];

// "Other" is the fallback bucket: expenses are moved there when a custom
// category is deleted, so it can never be removed itself.
export const FALLBACK_CATEGORY_KEY: CategoryKey = "other";

export const PAYMENT_METHODS = ["cash", "card", "mobile_banking", "bank"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const CURRENCIES = ["BDT", "USD", "EUR", "GBP", "INR"] as const;
