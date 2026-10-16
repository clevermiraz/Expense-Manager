"use client";

import { Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

export function DeleteAccount({ email }: { email: string }) {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-3xl border border-danger/30 bg-surface p-4 shadow-card sm:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
          <TriangleAlert className="size-4.5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink">{t("dangerZone")}</h2>
          <p className="mt-0.5 text-sm text-ink-3">{t("dangerHint")}</p>
        </div>
      </div>
      <Button type="button" variant="danger" className="mt-4" onClick={() => setOpen(true)}>
        <Trash2 className="size-4" aria-hidden />
        {t("deleteAccount")}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t("deleteConfirmTitle")} closeLabel={tc("close")}>
        <DialogBody>
          {open && <DeleteForm email={email} onCancel={() => setOpen(false)} />}
        </DialogBody>
      </Dialog>
    </section>
  );
}

function DeleteForm({ email, onCancel }: { email: string; onCancel: () => void }) {
  const t = useTranslations("settings");
  const ta = useTranslations("auth");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setPending(true);
        const { error } = await authClient.deleteUser({ password });
        if (error) {
          setPending(false);
          return setError(error.code === "INVALID_PASSWORD" ? t("incorrectPassword") : ta("genericError"));
        }
        router.push("/");
        router.refresh();
      }}
    >
      <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-ink">{t("deleteConfirmBody", { email })}</p>
      <Field label={t("deletePasswordLabel")} htmlFor="delete-password" error={error}>
        <Input
          id="delete-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!error}
          required
          data-autofocus
        />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={pending}>
          {t("cancel")}
        </Button>
        <Button type="submit" variant="danger" loading={pending} disabled={!password}>
          {t("deleteConfirmButton")}
        </Button>
      </div>
    </form>
  );
}
