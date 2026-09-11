"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  Wallet2,
  ArrowLeftRight,
  CircleDollarSign,
  UserCog,
  Bell,
  BarChart3,
  Settings,
  Radio,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/context/AppDataContext";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/groups", label: "My Groups", icon: Users2 },
    ],
  },
  {
    label: "Savings",
    items: [
      { href: "/contributions", label: "Contributions", icon: CircleDollarSign },
      { href: "/payouts", label: "Payouts", icon: Wallet2 },
      { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/members", label: "Members", icon: UserCog },
      { href: "/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Insights",
    items: [{ href: "/reports", label: "Reports", icon: BarChart3 }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { unreadNotificationCount } = useAppData();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 font-display text-sm font-bold text-white">
          H
        </div>
        <span className="font-display text-[17px] font-bold tracking-tight text-foreground">
          HulogHub
        </span>
      </div>

      <nav className="thin-scroll flex-1 overflow-y-auto px-4 py-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary-50 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.label === "Notifications" && unreadNotificationCount > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mb-2">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Preferences
          </p>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/settings"
                ? "bg-primary-50 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-3 dark:border-primary-800 dark:bg-primary-900/30">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-800 dark:text-primary-300">
            <Sparkles className="h-3.5 w-3.5" /> Demo Mode
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-primary-700 dark:text-primary-400">
            <Radio className="h-3 w-3 animate-pulse" /> Stellar Network Connected
          </p>
        </div>
      </div>
    </aside>
  );
}
