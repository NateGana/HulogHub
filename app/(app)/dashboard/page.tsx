"use client";

import { useMemo, useState } from "react";
import {
  Wallet,
  Users2,
  CalendarClock,
  Landmark,
  Plus,
} from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { GroupCard } from "@/components/ui/GroupCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardSkeleton } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { peso, formatShortDate, dueLabel } from "@/lib/utils";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const RANGES = ["7D", "1M", "3M", "6M", "1Y"] as const;
type Range = (typeof RANGES)[number];

const RANGE_POINTS: Record<Range, number> = { "7D": 7, "1M": 6, "3M": 8, "6M": 6, "1Y": 12 };

export default function DashboardPage() {
  const { data, loading, totalSaved, activeGroupsCount, upcomingContribution, nextPayout } = useAppData();
  const [range, setRange] = useState<Range>("6M");

  const chartData = useMemo(() => {
    const points = RANGE_POINTS[range];
    const base = Math.max(totalSaved * 0.3, 1000);
    return Array.from({ length: points }).map((_, i) => {
      const progress = (i + 1) / points;
      const noise = Math.sin(i * 1.7) * totalSaved * 0.02;
      return {
        label:
          range === "7D"
            ? `Day ${i + 1}`
            : range === "1Y"
              ? ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][i]
              : ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].slice(0, points)[i],
        value: Math.max(0, Math.round(base + (totalSaved - base) * progress + noise)),
      };
    });
  }, [range, totalSaved]);

  if (loading || !data) return <DashboardSkeleton />;

  const firstName = data.currentUser.name.split(" ")[0];
  const activeGroups = data.groups.filter((g) => g.status !== "invited").slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Good {timeOfDayGreeting()}, {firstName} 👋
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Here's your savings overview.</p>
        </div>
        <Link href="/groups">
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" /> Create Group
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          label="Total Saved"
          value={peso(totalSaved, false)}
          delta="+12.4% this month"
          icon={Wallet}
        />
        <DashboardCard label="Active Groups" value={String(activeGroupsCount)} icon={Users2} />
        <DashboardCard
          label="Upcoming Contribution"
          value={upcomingContribution ? peso(upcomingContribution.amount, false) : "—"}
          sub={upcomingContribution ? dueLabel(upcomingContribution.date).label : "No upcoming dues"}
          icon={CalendarClock}
        />
        <DashboardCard
          label="Next Payout"
          value={nextPayout ? peso(nextPayout.amount, false) : "—"}
          sub={nextPayout ? formatShortDate(nextPayout.date) : "None scheduled"}
          icon={Landmark}
        />
      </div>

      <ChartCard
        title="Savings Growth"
        subtitle="Your total verified contributions over time"
        action={
          <div className="flex gap-1 rounded-lg border border-border p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  range === r ? "bg-primary-700 text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => `₱${Math.round(v / 1000)}K`}
                width={48}
              />
              <Tooltip
                formatter={(value: number) => [peso(value, false), "Saved"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#059669"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
                fill="url(#savingsGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Active Paluwagan Groups</h3>
          <Link href="/groups" className="text-sm font-medium text-primary-700 hover:underline dark:text-primary-400">
            View all
          </Link>
        </div>
        {activeGroups.length === 0 ? (
          <EmptyState
            icon={Users2}
            title="No savings groups yet"
            description="Start your first Paluwagan group and save together with people you trust."
            action={
              <Link href="/groups">
                <Button className="gap-1.5">
                  <Plus className="h-4 w-4" /> Create Group
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeGroups.map((g) => (
              <GroupCard key={g.id} group={g} members={data.members} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
