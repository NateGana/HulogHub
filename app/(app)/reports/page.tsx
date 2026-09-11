"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useAppData } from "@/context/AppDataContext";
import { ChartCard } from "@/components/ui/ChartCard";
import { CardSkeleton } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { peso } from "@/lib/utils";

const RANGES = ["7 Days", "30 Days", "3 Months", "6 Months", "1 Year"] as const;
const PIE_COLORS = ["#059669", "#0EA5E9", "#C89B3C", "#DC2626", "#6D28D9", "#0F766E"];

export default function ReportsPage() {
  const { data, loading, totalSaved } = useAppData();
  const [range, setRange] = useState<(typeof RANGES)[number]>("6 Months");

  const monthlyContributions = useMemo(() => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    if (!data) return [];
    return months.map((label, i) => ({
      label,
      amount: Math.round(
        data.contributions
          .filter((c) => c.status === "verified" || c.status === "paid")
          .reduce((s, c) => s + c.amount, 0) * ((i + 1) / months.length) * (0.6 + i * 0.08),
      ),
    }));
  }, [data]);

  const byGroup = useMemo(() => {
    if (!data) return [];
    return data.groups.map((g) => ({
      name: g.name,
      value: data.contributions.filter((c) => c.groupId === g.id).reduce((s, c) => s + c.amount, 0) || 1,
    }));
  }, [data]);

  const payoutDistribution = useMemo(() => {
    if (!data) return [];
    return data.groups.map((g) => ({
      name: g.name.split(" ")[0],
      amount: data.payouts.filter((p) => p.groupId === g.id).reduce((s, p) => s + p.amount, 0),
    }));
  }, [data]);

  const savingsGrowth = useMemo(() => {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    return months.map((label, i) => ({ label, value: Math.round(totalSaved * ((i + 1) / months.length)) }));
  }, [totalSaved]);

  if (loading || !data) return <CardSkeleton className="h-96" />;

  function exportCsv() {
    const header = "Date,Description,Group,Amount,Type,Status\n";
    const rows = data!.transactions
      .map((t) => {
        const group = data!.groups.find((g) => g.id === t.groupId)?.name ?? "";
        return [t.date, t.description, group, t.amount, t.type, t.status].join(",");
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "huloghub-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Reports</h2>
          <p className="mt-1 text-sm text-muted-foreground">Financial analytics across all your savings groups.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as (typeof RANGES)[number])}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none"
          >
            {RANGES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <Button variant="outline" className="gap-1.5" onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Total Contributions" subtitle="Monthly contribution volume">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyContributions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₱${Math.round(v / 1000)}K`} width={44} />
                <Tooltip formatter={(v: number) => [peso(v, false), "Contributions"]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                <Bar dataKey="amount" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Contributions by Group" subtitle="Share of total contributions">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byGroup} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {byGroup.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => peso(v, false)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Payout Distribution" subtitle="Total payouts by group">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payoutDistribution} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₱${Math.round(v / 1000)}K`} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={70} />
                <Tooltip formatter={(v: number) => peso(v, false)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                <Bar dataKey="amount" fill="#C89B3C" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Savings Growth" subtitle="Cumulative verified savings">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₱${Math.round(v / 1000)}K`} width={44} />
                <Tooltip formatter={(v: number) => [peso(v, false), "Saved"]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
