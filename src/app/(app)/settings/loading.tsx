import { getTranslations } from "next-intl/server";
import { SettingsSkeleton } from "@/components/skeletons";

export default async function Loading() {
  const t = await getTranslations("settings");
  return <SettingsSkeleton title={t("title")} />;
}
