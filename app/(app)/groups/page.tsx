"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Users2, UserPlus } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { GroupCard } from "@/components/ui/GroupCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { CreateGroupWizard } from "@/components/groups/CreateGroupWizard";
import { GroupStatus } from "@/types";

const FILTERS: { value: GroupStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "invited", label: "Invited" },
];

export default function GroupsPage() {
  const { data, loading } = useAppData();
  const [filter, setFilter] = useState<GroupStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);

  const filteredGroups = useMemo(() => {
    if (!data) return [];
    return data.groups.filter((g) => {
      const matchesFilter = filter === "all" || g.status === filter;
      const matchesQuery = g.name.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [data, filter, query]);

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">My Groups</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your savings circles and contribution schedules.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5">
            <UserPlus className="h-4 w-4" /> Join Group
          </Button>
          <Button className="gap-1.5" onClick={() => setWizardOpen(true)}>
            <Plus className="h-4 w-4" /> Create Group
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border p-1">
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
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search groups..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 sm:w-64"
          />
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No groups found"
          description="Try a different filter or search term, or start a brand-new savings group."
          action={
            <Button className="gap-1.5" onClick={() => setWizardOpen(true)}>
              <Plus className="h-4 w-4" /> Create Group
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((g) => (
            <GroupCard key={g.id} group={g} members={data.members} />
          ))}
        </div>
      )}

      <CreateGroupWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
