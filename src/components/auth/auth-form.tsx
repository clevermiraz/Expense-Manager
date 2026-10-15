"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only allow same-origin relative redirects after login. */
function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/dashboard";
}

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isRegister = mode === "register";

  function validate() {
    const e: Record<string, string> = {};
    if (isRegister && !name.trim()) e.name = t("nameRequired");
    if (!EMAIL_RE.test(email.trim())) e.email = t("emailInvalid");
    if (isRegister ? password.length < 8 : !password) e.password = isRegister ? t("passwordTooShort") : t("passwordRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setPending(true);

    const { error } = isRegister
      ? await authClient.signUp.email({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      : await authClient.signIn.email({ email: email.trim().toLowerCase(), password });

    if (error) {
      setPending(false);
      if (error.status === 429) return setFormError(t("tooManyAttempts"));
      switch (error.code) {
        case "INVALID_EMAIL_OR_PASSWORD":
          return setFormError(t("invalidCredentials"));
        case "USER_ALREADY_EXISTS":
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          return setErrors({ email: t("emailTaken") });
        case "PASSWORD_TOO_SHORT":
          return setErrors({ password: t("passwordTooShort") });
        case "INVALID_EMAIL":
          return setErrors({ email: t("emailInvalid") });
        default:
          return setFormError(t("genericError"));
      }
    }
    router.push(safeNext(next));
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-ink">{isRegister ? t("registerTitle") : t("loginTitle")}</h1>
      <p className="mt-1 text-sm text-ink-3">{isRegister ? t("registerSubtitle") : t("loginSubtitle")}</p>

      <form noValidate onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        {isRegister && (
          <Field label={t("name")} htmlFor="name" error={errors.name}>
            <Input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              maxLength={80}
            />
          </Field>
        )}
        <Field label={t("email")} htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
        </Field>
        <Field
          label={t("password")}
          htmlFor="password"
          error={errors.password}
          hint={isRegister ? t("passwordHint") : undefined}
        >
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              className="pr-10"
              maxLength={128}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-3 hover:text-ink cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        {formError && (
          <p role="alert" className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" loading={pending} className="mt-1 w-full">
          {isRegister ? t("registerButton") : t("loginButton")}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-3">
        {isRegister ? t("haveAccount") : t("noAccount")}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="font-medium text-primary hover:underline">
          {isRegister ? t("loginLink") : t("registerLink")}
        </Link>
      </p>
    </div>
  );
}
