"use client";

import { useTranslations } from "next-intl";
import { useErrorText } from "@/lib/use-error-text";
import { useMemo, useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { CURRENCIES } from "@/lib/default-categories";

export function ProfileForm(props: { name: string; currency: string; timezone: string }) {
  const t = useTranslations("settings");
  const te = useErrorText();
  const [name, setName] = useState(props.name);
  const [currency, setCurrency] = useState(props.currency);
  const [timezone, setTimezone] = useState(props.timezone);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const zones = useMemo(() => {
    const all = Intl.supportedValuesOf("timeZone");
    return all.includes(props.timezone) ? all : [props.timezone, ...all];
  }, [props.timezone]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setErrors({});
        startTransition(async () => {
          const res = await updateProfile({ name, currency, timezone });
          if (!res.ok) {
            if (res.fields) setErrors(res.fields);
            else toast(te(res.error), "error");
            return;
          }
          toast(t("saved"));
        });
      }}
    >
      <Field label={t("name")} htmlFor="profile-name" error={errors.name ? te(errors.name) : null}>
        <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("currency")} htmlFor="profile-currency">
          <Select id="profile-currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {t(`currencies.${c}`)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={t("timezone")} htmlFor="profile-tz" hint={t("timezoneHint")}>
          <Select id="profile-tz" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div>
        <Button type="submit" loading={pending}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
