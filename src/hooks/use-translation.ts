
"use client";

import { useLocalStorage } from "./use-local-storage";
import { translations } from "@/lib/translations";
import { useEffect, useState } from "react";

export function useTranslation() {
  const [language] = useLocalStorage("uiLanguage", "en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = (key: string): string => {
    if (!isMounted) {
        return key;
    }
    return translations[language]?.[key] || key;
  };

  return { t, language, isMounted };
}
