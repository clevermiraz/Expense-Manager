import { getTranslations } from "next-intl/server";
import { ExpensesSkeleton } from "@/components/skeletons";

export default async function Loading() {
  const t = await getTranslations("expenses");
  return <ExpensesSkeleton title={t("title")} />;
}
