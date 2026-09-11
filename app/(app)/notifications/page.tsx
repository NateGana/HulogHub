"use client";

import { Bell, CircleDollarSign, Landmark, Users2, ShieldCheck, Link2, CheckCheck, Trash2 } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types";

const ICONS: Record<NotificationType, typeof Bell> = {
  contribution: CircleDollarSign,
  payout: Landmark,
  group: Users2,
  security: ShieldCheck,
  blockchain: Link2,
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const { data, loading, markNotificationRead, markAllNotificationsRead, clearNotifications } = useAppData();

  if (loading || !data) return <CardSkeleton className="h-96" />;

  const notifications = [...data.notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="mt-1 text-sm text-muted-foreground">Stay on top of contributions, payouts, and group activity.</p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllNotificationsRead}>
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={clearNotifications}>
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </Button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New notifications about your groups will show up here." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {notifications.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-3.5 border-b border-border/60 px-5 py-4 text-left transition-colors last:border-0 hover:bg-muted/30",
                  !n.read && "bg-primary-50/40 dark:bg-primary-900/10",
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    n.type === "blockchain"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(n.date)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
