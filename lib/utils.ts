import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Philippine Peso, e.g. peso(1500) -> "₱1,500.00" */
export function peso(amount: number, withCents = true): string {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  }).format(amount);
  return formatted.replace("PHP", "₱").replace("₱", "₱").trim();
}

export function formatDate(dateStr: string, opts: Intl.DateTimeFormatOptions = {}): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  });
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - now.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/** Human reminder label used across Dashboard / Contributions, e.g. "Due in 3 days" */
export function dueLabel(dateStr: string): { label: string; urgency: "ok" | "soon" | "overdue" } {
  const days = daysUntil(dateStr);
  if (days < 0) return { label: `Overdue by ${Math.abs(days)}d`, urgency: "overdue" };
  if (days === 0) return { label: "Due today", urgency: "soon" };
  if (days === 1) return { label: "Due tomorrow", urgency: "soon" };
  if (days <= 7) return { label: `Due in ${days} days`, urgency: "soon" };
  return { label: `Due ${formatShortDate(dateStr)}`, urgency: "ok" };
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

/** Generate a realistic-looking (but fake) Stellar-style public key for demo mode. */
export function mockStellarAddress(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let s = "G";
  for (let i = 0; i < 55; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function truncateAddress(address: string, head = 4, tail = 4): string {
  if (address.length <= head + tail) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

export function truncateHash(hash: string): string {
  return truncateAddress(hash, 4, 4);
}
