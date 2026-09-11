"use client";

import { useMemo, useState } from "react";
import { UserPlus, Trash2, Eye, MoreVertical } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InviteModal } from "@/components/members/InviteModal";
import { Drawer } from "@/components/ui/Drawer";
import { peso, formatDate } from "@/lib/utils";
import { Member } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function MembersPage() {
  const { data, loading, removeMember, changeMemberRole } = useAppData();
  const { showToast } = useToast();
  const [groupId, setGroupId] = useState<string>("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [detail, setDetail] = useState<Member | null>(null);
  const [removeTarget, setRemoveTarget] = useState<{ memberId: string; groupId: string } | null>(null);

  const rows = useMemo(() => {
    if (!data) return [];
    if (groupId === "all") return data.members;
    const group = data.groups.find((g) => g.id === groupId);
    return data.members.filter((m) => group?.memberIds.includes(m.id));
  }, [data, groupId]);

  if (loading || !data) return <CardSkeleton className="h-96" />;

  const activeGroupForInvite = data.groups.find((g) => g.id === groupId) ?? data.groups[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Members</h2>
          <p className="mt-1 text-sm text-muted-foreground">Everyone across your savings groups.</p>
        </div>
        <Button className="gap-1.5" onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4" /> Invite Member
        </Button>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border p-1">
        <button
          onClick={() => setGroupId("all")}
          className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            groupId === "all" ? "bg-primary-700 text-white" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          All Groups
        </button>
        {data.groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setGroupId(g.id)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              groupId === g.id ? "bg-primary-700 text-white" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={UserPlus} title="No members yet" description="Invite people to start building your savings circle." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="thin-scroll overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Member</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Total Contributions</th>
                  <th className="px-5 py-3 font-medium">Last Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Payout Position</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <MemberAvatar name={m.name} initials={m.initials} color={m.avatarColor} size="sm" />
                        <div>
                          <p className="font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize">{m.role}</td>
                    <td className="px-5 py-3 font-mono tabular">{peso(m.totalContributed, false)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{m.lastPaymentDate ? formatDate(m.lastPaymentDate) : "—"}</td>
                    <td className="px-5 py-3"><StatusBadge status={m.status} /></td>
                    <td className="px-5 py-3">#{m.payoutPosition}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setDetail(m)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="View member">
                          <Eye className="h-4 w-4" />
                        </button>
                        {groupId !== "all" && (
                          <button
                            onClick={() => setRemoveTarget({ memberId: m.id, groupId })}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-danger dark:hover:bg-red-900/20"
                            aria-label="Remove member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        groupId={activeGroupForInvite?.id ?? ""}
        groupName={activeGroupForInvite?.name ?? "your group"}
      />

      <Drawer open={!!detail} onClose={() => setDetail(null)} title="Member Details">
        {detail && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <MemberAvatar name={detail.name} initials={detail.initials} color={detail.avatarColor} size="lg" />
              <div>
                <p className="font-display text-base font-semibold">{detail.name}</p>
                <p className="text-sm text-muted-foreground">{detail.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <select
                  value={detail.role}
                  onChange={(e) => {
                    changeMemberRole(detail.id, e.target.value as Member["role"]);
                    showToast("Role updated.", "success");
                  }}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm capitalize outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payout Position</p>
                <p className="mt-1.5 font-semibold">#{detail.payoutPosition}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Contributed</p>
                <p className="mt-1.5 font-mono font-semibold">{peso(detail.totalContributed, false)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Payment</p>
                <p className="mt-1.5 font-semibold">{detail.lastPaymentDate ? formatDate(detail.lastPaymentDate) : "—"}</p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) {
            removeMember(removeTarget.groupId, removeTarget.memberId);
            showToast("Member removed.", "info");
          }
          setRemoveTarget(null);
        }}
        title="Remove this member?"
        description="They will lose access to this group's contribution and payout schedule."
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}
