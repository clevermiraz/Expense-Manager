"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useErrorText } from "@/lib/use-error-text";
import { useState, useTransition } from "react";
import { createCategory, deleteCategory, updateCategory } from "@/app/actions/categories";
import { useApp, useCategoryLabel } from "@/components/app-context";
import { CATEGORY_COLORS, CATEGORY_ICONS, CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import type { Category } from "@/lib/data";
import { FALLBACK_CATEGORY_KEY } from "@/lib/default-categories";

export function CategoryManager() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const { categories } = useApp();
  const label = useCategoryLabel();
  const [editing, setEditing] = useState<Category | "new" | null>(null);

  return (
    <>
      <ul className="-mx-2 flex flex-col" data-testid="category-list">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted">
            <CategoryIcon icon={c.icon} color={c.color} size="sm" />
            <span className="flex-1 text-sm font-medium text-ink">{label(c)}</span>
            {c.key && <span className="text-xs text-ink-3">{t("builtIn")}</span>}
            <button
              type="button"
              onClick={() => setEditing(c)}
              aria-label={t("editCategory", { name: label(c) })}
              className="rounded-lg p-1.5 text-ink-3 hover:bg-surface hover:text-ink cursor-pointer max-sm:p-2.5"
            >
              <Pencil className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <Button variant="secondary" className="mt-3" onClick={() => setEditing("new")}>
        <Plus className="size-4" aria-hidden />
        {t("addCategory")}
      </Button>
      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? t("addCategory") : t("editCategoryTitle")}
        closeLabel={tc("close")}
      >
        {editing !== null && (
          <DialogBody>
            <CategoryForm
              key={editing === "new" ? "new" : editing.id}
              category={editing === "new" ? null : editing}
              onDone={() => setEditing(null)}
            />
          </DialogBody>
        )}
      </Dialog>
    </>
  );
}

function CategoryForm({ category, onDone }: { category: Category | null; onDone: () => void }) {
  const t = useTranslations("settings");
  const te = useErrorText();
  const label = useCategoryLabel();
  const builtIn = !!category?.key;
  const [name, setName] = useState(category?.name ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "tag");
  const [color, setColor] = useState(category?.color ?? CATEGORY_COLORS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setErrors({});
        startTransition(async () => {
          const input = builtIn ? { icon, color } : { name, icon, color };
          const res = category ? await updateCategory(category.id, input) : await createCategory({ name, icon, color });
          if (!res.ok) {
            if (res.fields) setErrors(res.fields);
            else toast(te(res.error), "error");
            return;
          }
          toast(t("categorySaved"));
          onDone();
        });
      }}
    >
      {builtIn ? (
        <p className="text-sm text-ink-2">
          {t("builtInHint", { name: label(category!) })}
        </p>
      ) : (
        <Field label={t("categoryName")} htmlFor="category-name" error={errors.name ? te(errors.name) : null}>
          <Input id="category-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoFocus />
        </Field>
      )}

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-ink-2">{t("icon")}</legend>
        <div role="radiogroup" aria-label={t("icon")} className="grid grid-cols-8 gap-1.5">
          {Object.entries(CATEGORY_ICONS).map(([key, Icon]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={icon === key}
              aria-label={key}
              onClick={() => setIcon(key)}
              className={`flex aspect-square items-center justify-center rounded-lg border cursor-pointer ${
                icon === key ? "border-primary bg-primary-soft text-primary" : "border-line text-ink-2 hover:bg-muted"
              }`}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-ink-2">{t("color")}</legend>
        <div role="radiogroup" aria-label={t("color")} className="flex flex-wrap gap-2">
          {CATEGORY_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={color === c}
              aria-label={c}
              onClick={() => setColor(c)}
              className={`size-7 rounded-full ring-offset-2 ring-offset-surface cursor-pointer ${color === c ? "ring-2 ring-ink" : ""}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm">
        <CategoryIcon icon={icon} color={color} />
        <span className="font-medium text-ink">{builtIn ? label(category!) : name || t("preview")}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {category && category.key !== FALLBACK_CATEGORY_KEY ? (
          <Button
            type="button"
            variant="ghost"
            className="text-danger"
            loading={deleting}
            onClick={() => {
              if (!confirming) return setConfirming(true);
              startDelete(async () => {
                const res = await deleteCategory(category.id);
                if (!res.ok) return toast(te(res.error), "error");
                toast(t("categoryDeleted"));
                onDone();
              });
            }}
          >
            <Trash2 className="size-4" aria-hidden />
            {confirming ? t("confirmDeleteCategory") : t("deleteCategory")}
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" loading={pending}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
