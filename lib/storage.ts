// ============================================================
// lib/storage.ts
//
// Thin wrapper around browser localStorage so the rest of the
// app never touches `window.localStorage` directly. This makes
// it trivial to later swap in a real backend/database — only
// this file (and lib/api.ts) would need to change.
// ============================================================

const NAMESPACE = "huloghub:v1:";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(NAMESPACE + key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
    } catch {
      // localStorage may be unavailable (private mode, quota exceeded, etc.)
      // Fail silently — the app should still work in-memory for the session.
    }
  },

  remove(key: string): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(NAMESPACE + key);
  },

  clearAll(): void {
    if (!isBrowser()) return;
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(NAMESPACE))
      .forEach((k) => window.localStorage.removeItem(k));
  },
};

export const STORAGE_KEYS = {
  APP_DATA: "app-data",
  THEME: "theme",
} as const;
