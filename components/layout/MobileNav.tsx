"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users2,
  ArrowLeftRight,
  Wallet2,
  Menu,
  X,
  CircleDollarSign,
  UserCog,
  Bell,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/context/AppDataContext";

const TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/groups", label: "Groups", icon: Users2 },
  { href: "/transactions", label: "Activity", icon: ArrowLeftRight },
  { href: "/wallet", label: "Wallet", icon: Wallet2 },
];

const MORE_LINKS = [
  { href: "/contributions", label: "Contributions", icon: CircleDollarSign },
  { href: "/payouts", label: "Payouts", icon: Wallet2 },
  { href: "/members", label: "Members", icon: UserCog },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { unreadNotificationCount } = useAppData();

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname?.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium",
                active ? "text-primary-700 dark:text-primary-400" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="relative flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
          More
          {unreadNotificationCount > 0 && (
            <span className="absolute right-6 top-1 h-2 w-2 rounded-full bg-gold" />
          )}
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMoreOpen(false)} />
          <div className="relative z-10 w-full animate-[fade-in_0.2s_ease-out] rounded-t-2xl border-t border-border bg-card p-5 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-foreground">More</h3>
              <button onClick={() => setMoreOpen(false)} className="rounded-lg p-1.5 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {MORE_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Icon className="h-5 w-5 text-primary-700 dark:text-primary-400" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
