// ============================================================
// lib/api.ts
//
// Service-layer abstraction. Every "would hit the backend" call
// in the app goes through here instead of touching localStorage
// or Stellar directly. Today this reads/writes localStorage and
// calls the demo Stellar service; swapping to a real backend
// later means changing only this file's internals, not the
// components/pages that call it.
// ============================================================

import { AppDataShape } from "@/types";
import { buildSeedData } from "./mock-data";
import { storage, STORAGE_KEYS } from "./storage";

export async function loadAppData(): Promise<AppDataShape> {
  // Simulate a brief network/read delay so loading states are meaningful.
  await wait(250);
  return storage.get<AppDataShape>(STORAGE_KEYS.APP_DATA, buildSeedData());
}

export function persistAppData(data: AppDataShape): void {
  storage.set(STORAGE_KEYS.APP_DATA, data);
}

export function resetAppData(): AppDataShape {
  const fresh = buildSeedData();
  storage.set(STORAGE_KEYS.APP_DATA, fresh);
  return fresh;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
