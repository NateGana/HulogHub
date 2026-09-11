"use client";

import Link from "next/link";
import { CalendarClock, Users } from "lucide-react";
import { Group, Member } from "@/types";
import { peso, formatShortDate } from "@/lib/utils";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { AvatarStack } from "./MemberAvatar";
import { Button } from "./Button";

export function GroupCard({ group, members }: { group: Group; members: Member[] }) {
  const groupMembers = group.memberIds
    .map((id) => members.find((m) => m.id === id))
    .filter(Boolean) as Member[];

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-700 font-display text-lg font-bold text-white">
            {group.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-display text-[15px] font-semibold leading-tight text-foreground">
              {group.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" /> {group.memberIds.length} members
            </p>
          </div>
        </div>
        <StatusBadge status={group.status} />
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="font-mono text-lg font-bold tabular text-foreground">
          {peso(group.contributionAmount, false)}
        </span>
        <span className="text-xs capitalize text-muted-foreground">/ {group.frequency}</span>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Cycle {group.currentCycle} of {group.totalCycles}
          </span>
          <span className="font-semibold text-foreground">{group.progress}%</span>
        </div>
        <ProgressBar value={group.progress} />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarClock className="h-3.5 w-3.5" />
          Next: {formatShortDate(group.nextContributionDate)}
        </span>
        <AvatarStack members={groupMembers} max={4} />
      </div>

      <Link href={`/groups/${group.id}`} className="mt-5">
        <Button variant="secondary" className="w-full">
          View Group
        </Button>
      </Link>
    </div>
  );
}
