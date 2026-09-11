"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  UserPlus,
  Settings2,
  CircleDollarSign,
  Users2,
  CalendarClock,
  ShieldCheck,
  ExternalLink,
  Trash2,
  ArrowLeft,
  Check,
  Circle,
} from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InviteModal } from "@/components/members/InviteModal";
import { ContributeModal } from "@/components/contributions/ContributeModal";
import { LoadingState } from "@/components/ui/LoadingState";
import { peso, formatDate, formatShortDate } from "@/lib/utils";
import * as stellar from "@/lib/stellar";
import Link from "next/link";

export default function GroupDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, deleteGroup } = useAppData();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [ledgerInfo, setLedgerInfo] = useState<{ latestLedger: number; lastSyncSecondsAgo: number } | null>(null);

  useEffect(() => {
    stellar.getLedgerInfo().then(setLedgerInfo);
  }, []);

  const group = data?.groups.find((g) => g.id === params.id);
  const members = useMemo(
    () => (group ? group.memberIds.map((id) => data?.members.find((m) => m.id === id)).filter(Boolean) : []),
    [group, data],
  ) as NonNullable<typeof data>["members"];

  const contributions = useMemo(
    () => data?.contributions.filter((c) => c.groupId === group?.id && c.cycle === group?.currentCycle) ?? [],
    [data, group],
  );

  const payouts = useMemo(
    () => data?.payouts.filter((p) => p.groupId === group?.id).sort((a, b) => a.cycle - b.cycle) ?? [],
    [data, group],
  );

  if (loading || !data) return <LoadingState label="Loading group..." />;

  if (!group) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted-foreground">This group could not be found.</p>
        <Link href="/groups" className="mt-4 inline-block">
          <Button variant="outline">Back to My Groups</Button>
        </Link>
      </div>
    );
  }

  const currentUserMember = data.members.find((m) => m.userId === data.currentUser.id) ?? members[0];

  return (
    <div className="space-y-6">
      <Link href="/groups" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to My Groups
      </Link>

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-2xl font-bold tracking-tight">{group.name}</h2>
            <StatusBadge status={group.status} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users2 className="h-3.5 w-3.5" /> {group.memberIds.length} Members</span>
            <span className="flex items-center gap-1"><CircleDollarSign className="h-3.5 w-3.5" /> {peso(group.contributionAmount, false)}</span>
            <span className="capitalize">{group.frequency}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-1.5" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" /> Invite Member
          </Button>
          <Button className="gap-1.5" onClick={() => setContributeOpen(true)}>
            <CircleDollarSign className="h-4 w-4" /> Make Contribution
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)} aria-label="Manage group">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cycle progress */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">Cycle {group.currentCycle} of {group.totalCycles}</span>
          <span className="font-semibold text-primary-700 dark:text-primary-400">{group.progress}%</span>
        </div>
        <ProgressBar value={group.progress} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Contribution matrix */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h3 className="mb-4 font-display text-base font-semibold">Contribution Progress — Cycle {group.currentCycle}</h3>
            <div className="thin-scroll -mx-1 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-1 pb-2 font-medium">Member</th>
                    <th className="px-1 pb-2 font-medium">Amount</th>
                    <th className="px-1 pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => {
                    const c = contributions.find((c) => c.memberId === m.id);
                    return (
                      <tr key={m.id} className="border-b border-border/60 last:border-0">
                        <td className="px-1 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <MemberAvatar name={m.name} initials={m.initials} color={m.avatarColor} size="xs" />
                            <span className="font-medium">{m.name}</span>
                          </div>
                        </td>
                        <td className="px-1 py-2.5 font-mono tabular">{peso(group.contributionAmount, false)}</td>
                        <td className="px-1 py-2.5">
                          <StatusBadge status={c?.status ?? "pending"} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout timeline */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <h3 className="mb-5 font-display text-base font-semibold">Payout Timeline</h3>
            <div className="relative space-y-6 pl-2">
              <div className="absolute bottom-2 left-[15px] top-2 w-px bg-border" />
              {payouts.map((p) => {
                const member = data.members.find((m) => m.id === p.recipientMemberId);
                const isDone = p.status === "completed";
                const isNext = p.status === "upcoming" && payouts.filter((x) => x.status === "upcoming")[0]?.id === p.id;
                return (
                  <div key={p.id} className="relative flex gap-4">
                    <div
                      className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        isDone
                          ? "border-primary-700 bg-primary-700 text-white"
                          : isNext
                            ? "border-gold bg-gold text-white"
                            : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : <Circle className="h-2.5 w-2.5 fill-current" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{member?.name ?? "Unassigned"}</p>
                      <p className="text-xs text-muted-foreground">
                        {isDone ? "Completed" : isNext ? "Upcoming" : "Scheduled"} ·{" "}
                        {formatShortDate(p.completedDate ?? p.scheduledDate)} · {peso(p.amount, false)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Blockchain transparency */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary-600" /> Blockchain Transparency
            </h3>
            <div className="space-y-3 text-sm">
              {[
                ["Network", "Stellar (Demo)"],
                ["Verification", "Verified"],
                ["Group Ledger", "Available"],
                ["Last Sync", ledgerInfo ? `${ledgerInfo.lastSyncSecondsAgo}s ago` : "Syncing..."],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full gap-1.5" size="sm">
              <ExternalLink className="h-3.5 w-3.5" /> View Blockchain Record
            </Button>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Demo Mode — this panel uses simulated ledger data, not a live Stellar record.
            </p>
          </div>

          {/* Members list */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
              <Users2 className="h-4 w-4" /> Members
            </h3>
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <MemberAvatar name={m.name} initials={m.initials} color={m.avatarColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">{m.role} · #{m.payoutPosition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} groupId={group.id} groupName={group.name} />
      <ContributeModal
        open={contributeOpen}
        onClose={() => setContributeOpen(false)}
        group={group}
        memberId={currentUserMember?.id ?? members[0]?.id ?? ""}
      />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteGroup(group.id);
          router.push("/groups");
        }}
        title="Delete this group?"
        description={`This will permanently remove "${group.name}" and its contribution/payout history. This can't be undone.`}
        confirmLabel="Delete Group"
        danger
      />
    </div>
  );
}
