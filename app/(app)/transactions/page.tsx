"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, ExternalLink, Search } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/LoadingState";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { peso, formatDate, truncateHash } from "@/lib/utils";
import { demoExplorerUrl } from "@/lib/stellar";
import { Transaction, TransactionType } from "@/types";
import { cn } from "@/lib/utils";

const TABS: { value: TransactionType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "contribution", label: "Contributions" },
  { value: "payout", label: "Payouts" },
  { value: "transfer", label: "Transfers" },
  { value: "fee", label: "Fees" },
];

export default function TransactionsPage() {
  const { data, loading } = useAppData();
  const [tab, setTab] = useState<TransactionType | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Transaction | null>(null);

  const rows = useMemo(() => {
    if (!data) return [];
    return data.transactions
      .filter((t) => tab === "all" || t.type === tab)
      .filter((t) => t.description.toLowerCase().includes(query.toLowerCase()));
  }, [data, tab, query]);

  if (loading || !data) return <CardSkeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your full financial transaction ledger.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.value ? "bg-primary-700 text-white" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 sm:w-64"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={ArrowLeftRight} title="No transactions found" description="Transactions will appear here as your groups become active." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="thin-scroll overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Group</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Blockchain</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => {
                  const group = data.groups.find((g) => g.id === t.groupId);
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-5 py-3 text-muted-foreground">{formatDate(t.date)}</td>
                      <td className="px-5 py-3 font-medium">{t.description}</td>
                      <td className="px-5 py-3 text-muted-foreground">{group?.name ?? "—"}</td>
                      <td
                        className={cn(
                          "px-5 py-3 font-mono tabular font-semibold",
                          t.amount < 0 ? "text-danger" : "text-primary-700 dark:text-primary-400",
                        )}
                      >
                        {t.amount < 0 ? "-" : "+"}
                        {peso(Math.abs(t.amount), false)}
                      </td>
                      <td className="px-5 py-3 capitalize text-muted-foreground">{t.type}</td>
                      <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-5 py-3 text-muted-foreground">Stellar</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Transaction Details">
        {selected && (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm font-semibold">{selected.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-semibold capitalize">{selected.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-mono text-sm font-semibold">{peso(Math.abs(selected.amount), false)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-semibold">{formatDate(selected.date)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Group</p>
                <p className="text-sm font-semibold">{data.groups.find((g) => g.id === selected.groupId)?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="mb-3 text-xs font-semibold text-foreground">Blockchain</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Network</span><span>Stellar (Demo)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ledger</span><span>{selected.stellarLedger ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Verification</span><StatusBadge status={selected.status} /></div>
              </div>
              {selected.stellarHash && (
                <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" /> View on Stellar Explorer
                </Button>
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">
                Demo Mode — placeholder explorer link, not a live network record.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
