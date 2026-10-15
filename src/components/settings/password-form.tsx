"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export function PasswordForm() {
  const t = useTranslations("settings");
  const ta = useTranslations("auth");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (next.length < 8) return setError(ta("passwordTooShort"));
        setPending(true);
        const { error } = await authClient.changePassword({
          currentPassword: current,
          newPassword: next,
          revokeOtherSessions: true,
        });
        setPending(false);
        if (error) return setError(error.code === "INVALID_PASSWORD" ? t("wrongPassword") : ta("genericError"));
        setCurrent("");
        setNext("");
        toast(t("passwordChanged"));
      }}
    >
      <Field label={t("currentPassword")} htmlFor="current-password">
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
      </Field>
      <Field label={t("newPassword")} htmlFor="new-password" error={error} hint={ta("passwordHint")}>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          minLength={8}
        />
      </Field>
      <div>
        <Button type="submit" variant="secondary" loading={pending}>
          {t("changePassword")}
        </Button>
      </div>
    </form>
  );
}
