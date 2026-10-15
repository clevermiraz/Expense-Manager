"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";

/** Translates a server error key, falling back to a generic message. */
export function useErrorText() {
  const t = useTranslations("errors");
  return useCallback((key: string) => (t.has(key) ? t(key) : t("generic")), [t]);
}
