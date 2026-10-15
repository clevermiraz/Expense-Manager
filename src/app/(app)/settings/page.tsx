import { Download } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CategoryManager } from "@/components/settings/category-manager";
import { PasswordForm } from "@/components/settings/password-form";
import { ProfileForm } from "@/components/settings/profile-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/components/nav";
import { PageHeader } from "@/components/page-header";
import { buttonClass } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { requireUser } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("settings") };
}

export default async function SettingsPage() {
  const user = await requireUser();
  const t = await getTranslations("settings");

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title={t("profile")} subtitle={user.email} />
            <ProfileForm name={user.name} currency={user.currency} timezone={user.timezone} />
          </Card>
          <Card>
            <CardHeader title={t("language")} subtitle={t("languageHint")} />
            <LanguageSwitcher />
          </Card>
          <Card>
            <CardHeader title={t("password")} />
            <PasswordForm />
          </Card>
          <Card>
            <CardHeader title={t("data")} subtitle={t("dataHint")} />
            <div className="flex flex-wrap gap-2">
              <a href="/api/export" className={buttonClass("secondary")} download>
                <Download className="size-4" aria-hidden />
                {t("exportAll")}
              </a>
              <SignOutButton className="border border-line" />
            </div>
          </Card>
        </div>
        <Card>
          <CardHeader title={t("categories")} subtitle={t("categoriesHint")} />
          <CategoryManager />
        </Card>
      </div>
    </>
  );
}
