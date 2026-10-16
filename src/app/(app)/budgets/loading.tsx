import { getTranslations } from "next-intl/server";
import { BudgetsSkeleton } from "@/components/skeletons";

export default async function Loading() {
  const t = await getTranslations("budgets");
  return <BudgetsSkeleton title={t("title")} />;
}
