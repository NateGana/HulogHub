"use client";

import { useMemo } from "react";
import { Landmark, Wallet2 } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/LoadingState";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { Button } from "@/components/ui/Button";
import { peso, formatDate, truncateHash } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function PayoutsPage() {
  const { data, loading, updatePayoutStatus } = useAppData();
  const { showToast } = useToast();

  const upcoming = useMemo(
    () =>
      [...(data?.payouts ?? [])]
        .filter((p) => p.status === "upcoming" || p.status === "processing")
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0],
    [data],
  );

  const history = useMemo(
    () => [...(data?.payouts ?? [])].sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()),
    [data],
  );

  if (loading || !data) return <CardSkeleton className="h-96" />;

  const upcomingGroup = upcoming ? data.groups.find((g) => g.id === upcoming.groupId) : null;
  const upcomingRecipient = upcoming ? data.members.find((m) => m.id === upcoming.recipientMemberId) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Payouts</h2>
        <p className="mt-1 text-sm text-muted-foreground">Track upcoming and completed group payouts.</p>
      </div>

      {upcoming ? (
        <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-card p-6 shadow-card dark:border-primary-800 dark:from-primary-950/30">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-primary-400">
            <Landmark className="h-3.5 w-3.5" /> Upcoming Payout
          </p>
          <p className="mt-2 font-display text-4xl font-bold tabular tracking-tight">{peso(upcoming.amount, false)}</p>
          <p className="mt-1 text-sm text-muted-foreground">{upcomingGroup?.name}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {upcomingRecipient && (
                <MemberAvatar name={upcomingRecipient.name} initials={upcomingRecipient.initials} color={upcomingRecipient.avatarColor} size="sm" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Recipient</p>
                <p className="text-sm font-semibold">{upcomingRecipient?.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Scheduled</p>
              <p className="text-sm font-semibold">{formatDate(upcoming.scheduledDate)}</p>
            </div>
          </div>
          {upcoming.status === "upcoming" && (
            <Button
              size="sm"
              className="mt-4 gap-1.5"
              onClick={() => {
                updatePayoutStatus(upcoming.id, "processing");
                showToast("Payout marked as processing.", "info");
              }}
            >
              <Wallet2 className="h-3.5 w-3.5" /> Start Processing
            </Button>
          )}
          {upcoming.status === "processing" && (
            <Button
              size="sm"
              className="mt-4 gap-1.5"
              onClick={() => {
                updatePayoutStatus(upcoming.id, "completed");
                showToast("Payout completed.", "success");
              }}
            >
              Mark as Completed
            </Button>
          )}
        </div>
      ) : (
        <EmptyState icon={Landmark} title="No upcoming payouts" description="Payouts will appear here as groups progress through their cycles." />
      )}

      <div>
        <h3 className="mb-4 font-display text-lg font-semibold">Payout History</h3>
        {history.length === 0 ? (
          <EmptyState icon={Wallet2} title="No payout history" description="Completed and scheduled payouts will show up here." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="thin-scroll overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Recipient</th>
                    <th className="px-5 py-3 font-medium">Group</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((p) => {
                    const recipient = data.members.find((m) => m.id === p.recipientMemberId);
                    const group = data.groups.find((g) => g.id === p.groupId);
                    return (
                      <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 font-medium">{recipient?.name ?? "—"}</td>
                        <td className="px-5 py-3 text-muted-foreground">{group?.name ?? "—"}</td>
                        <td className="px-5 py-3 font-mono tabular">{peso(p.amount, false)}</td>
                        <td className="px-5 py-3 text-muted-foreground">{formatDate(p.completedDate ?? p.scheduledDate)}</td>
                        <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                        <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                          {p.transactionId ? truncateHash(p.transactionId) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
