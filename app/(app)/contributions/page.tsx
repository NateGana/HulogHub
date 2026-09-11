"use client";

import { useMemo, useState } from "react";
import { CircleDollarSign, Filter } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { ContributeModal } from "@/components/contributions/ContributeModal";
import { peso, formatDate, truncateHash } from "@/lib/utils";
import { ContributionStatus } from "@/types";

const FILTERS: { value: ContributionStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "verified", label: "Verified" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "late", label: "Late" },
];

export default function ContributionsPage() {
  const { data, loading } = useAppData();
  const [filter, setFilter] = useState<ContributionStatus | "all">("all");
  const [contributeGroupId, setContributeGroupId] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!data) return [];
    return [...data.contributions]
      .filter((c) => filter === "all" || c.status === filter)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((c) => ({
        ...c,
        group: data.groups.find((g) => g.id === c.groupId),
        member: data.members.find((m) => m.id === c.memberId),
      }));
  }, [data, filter]);

  const contributeGroup = data?.groups.find((g) => g.id === contributeGroupId) ?? null;
  const currentUserMember = data?.members.find((m) => m.userId === data.currentUser.id) ?? data?.members[0];

  if (loading || !data) return <CardSkeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Contribution History</h2>
          <p className="mt-1 text-sm text-muted-foreground">Every contribution across your savings groups.</p>
        </div>
        <Button className="gap-1.5" onClick={() => setContributeGroupId(data.groups[0]?.id ?? null)}>
          <CircleDollarSign className="h-4 w-4" /> Make Contribution
        </Button>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-border p-1">
        <Filter className="ml-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.value ? "bg-primary-700 text-white" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={CircleDollarSign}
          title="No contributions yet"
          description="Once members start contributing, records will show up here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="thin-scroll overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Group</th>
                  <th className="px-5 py-3 font-medium">Member</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{c.group?.name ?? "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.member?.name ?? "—"}</td>
                    <td className="px-5 py-3 font-mono tabular">{peso(c.amount, false)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDate(c.date)}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {c.transactionId ? truncateHash(c.transactionId) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ContributeModal
        open={!!contributeGroupId}
        onClose={() => setContributeGroupId(null)}
        group={contributeGroup}
        memberId={currentUserMember?.id ?? ""}
      />
    </div>
  );
}
