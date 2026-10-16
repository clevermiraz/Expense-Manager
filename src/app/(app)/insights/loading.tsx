import { getTranslations } from "next-intl/server";
import { InsightsSkeleton } from "@/components/skeletons";

export default async function Loading() {
  const t = await getTranslations("insights");
  return <InsightsSkeleton title={t("title")} />;
}
