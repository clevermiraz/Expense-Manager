import { Download } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CategoryManager } from "@/components/settings/category-manager";
import { DeleteAccount } from "@/components/settings/delete-account";
import { PasswordForm } from "@/components/settings/password-form";
import { ProfileForm } from "@/components/settings/profile-form";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/components/nav";
import { PageHeader } from "@/components/page-header";
import { InstallCard } from "@/components/pwa/install";
import { ThemeSwitcher } from "@/components/theme";
import { buttonClass } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ReminderSettings } from "@/components/settings/reminder-settings";
import { getReminder } from "@/lib/data";
import { requireUser } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("settings") };
}

export default async function SettingsPage() {
  const user = await requireUser();
  const [t, tt, reminder] = await Promise.all([
    getTranslations("settings"),
    getTranslations("theme"),
    getReminder(user.id),
  ]);

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          {/* Signed-in account + sign out, first thing on the page. */}
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-from to-brand-to text-lg font-semibold text-white">
                {user.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{user.name}</p>
                <p className="truncate text-sm text-ink-3">{user.email}</p>
              </div>
              <SignOutButton danger className="max-sm:h-11 max-sm:w-full max-sm:justify-center" />
            </div>
          </Card>
          <InstallCard />
          <ReminderSettings hour={reminder.hour} />
          <Card>
            <CardHeader title={t("profile")} subtitle={user.email} />
            <ProfileForm name={user.name} currency={user.currency} timezone={user.timezone} />
          </Card>
          <Card>
            <CardHeader title={t("language")} subtitle={t("languageHint")} />
            <LanguageSwitcher />
          </Card>
          <Card>
            <CardHeader title={tt("label")} subtitle={tt("hint")} />
            <ThemeSwitcher />
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
            </div>
          </Card>
        </div>
        <Card>
          <CardHeader title={t("categories")} subtitle={t("categoriesHint")} />
          <CategoryManager />
        </Card>
      </div>
      <div className="mt-4">
        <DeleteAccount email={user.email} />
      </div>
    </>
  );
}
