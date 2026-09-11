"use client";

// ============================================================
// components/ThemeProvider.tsx
//
// Applies the user's theme preference (light / dark / system)
// as a class on <html>, and keeps it in sync with settings
// stored in AppDataContext. Persists independently in
// localStorage too so the correct theme can apply before the
// full app data has finished loading.
// ============================================================

import { useEffect } from "react";
import { useAppData } from "@/context/AppDataContext";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { ThemePreference } from "@/types";

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = theme === "dark" || (theme === "system" && systemDark);
  root.classList.toggle("dark", shouldBeDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data } = useAppData();

  useEffect(() => {
    // Apply cached theme immediately (before app data may have loaded).
    const cached = storage.get<ThemePreference>(STORAGE_KEYS.THEME, "system");
    applyTheme(cached);
  }, []);

  useEffect(() => {
    if (!data) return;
    applyTheme(data.settings.theme);
    storage.set(STORAGE_KEYS.THEME, data.settings.theme);
  }, [data?.settings.theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (data?.settings.theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [data?.settings.theme]);

  return <>{children}</>;
}
