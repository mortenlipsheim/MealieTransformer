
"use client";

import { useLocalStorage } from "./use-local-storage";
import { translations } from "@/lib/translations";

export function useTranslation() {
  const [language] = useLocalStorage("uiLanguage", "en");

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return { t, language };
}
