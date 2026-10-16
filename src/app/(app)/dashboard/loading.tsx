import { getTranslations } from "next-intl/server";
import { DashboardSkeleton } from "@/components/skeletons";

export default async function Loading() {
  const t = await getTranslations("dashboard");
  return <DashboardSkeleton title={t("title")} />;
}
