"use client";

import { useState } from "react";
import { Wallet2, Landmark, CheckCircle2, Loader2, LogOut, Copy } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { CardSkeleton } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { peso, truncateAddress, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function WalletPage() {
  const { data, loading, connectDemoWallet, disconnectDemoWallet } = useAppData();
  const { showToast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  if (loading || !data) return <CardSkeleton className="h-96" />;

  const { wallet } = data;

  async function handleConnect() {
    setConnecting(true);
    await connectDemoWallet();
    setConnecting(false);
    showToast("Wallet connected.", "success");
  }

  const recentTx = data.transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Wallet</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your HulogHub balance and Stellar wallet connection.</p>
      </div>

      {/* Hero balance */}
      <div className="rounded-2xl border border-primary-800 bg-gradient-to-br from-primary-800 to-primary-950 p-6 text-white shadow-card sm:p-8">
        <p className="flex items-center gap-1.5 text-xs font-medium text-primary-200">
          <Wallet2 className="h-3.5 w-3.5" /> HulogHub Wallet
        </p>
        <p className="mt-2 font-display text-4xl font-bold tabular tracking-tight sm:text-5xl">
          {peso(wallet.availableBalance)}
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
          <div>
            <p className="text-[11px] text-primary-200">Available Balance</p>
            <p className="mt-1 font-mono text-sm font-semibold tabular">{peso(wallet.availableBalance, false)}</p>
          </div>
          <div>
            <p className="text-[11px] text-primary-200">Pending</p>
            <p className="mt-1 font-mono text-sm font-semibold tabular">{peso(wallet.pendingBalance, false)}</p>
          </div>
          <div>
            <p className="text-[11px] text-primary-200">Total Contributions</p>
            <p className="mt-1 font-mono text-sm font-semibold tabular">{peso(wallet.totalContributions, false)}</p>
          </div>
        </div>
      </div>

      {/* Stellar wallet connection */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold">Stellar Wallet</p>
              {wallet.connected ? (
                <p className="flex items-center gap-1.5 text-xs text-primary-700 dark:text-primary-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-600" /> Connected
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          {!wallet.connected ? (
            <Button onClick={handleConnect} loading={connecting} className="gap-1.5">
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <Button variant="outline" className="gap-1.5" onClick={() => setDisconnectOpen(true)}>
              <LogOut className="h-3.5 w-3.5" /> Disconnect
            </Button>
          )}
        </div>

        {wallet.connected && wallet.address && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-600" />
            <span className="flex-1 truncate font-mono text-xs text-muted-foreground">{truncateAddress(wallet.address, 6, 6)}</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(wallet.address ?? "");
                showToast("Address copied.", "info");
              }}
              className="rounded-md p-1 hover:bg-muted"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <p className="mt-4 text-[11px] text-muted-foreground">
          HulogHub never asks for a private key or seed phrase. This is a simulated Demo Mode
          connection using a mock Stellar address for prototype purposes only.
        </p>
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <h3 className="mb-4 font-display text-base font-semibold">Recent Wallet Activity</h3>
        <div className="space-y-3">
          {recentTx.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{t.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
              </div>
              <p className={`font-mono text-sm font-semibold tabular ${t.amount < 0 ? "text-danger" : "text-primary-700 dark:text-primary-400"}`}>
                {t.amount < 0 ? "-" : "+"}
                {peso(Math.abs(t.amount), false)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={disconnectOpen}
        onClose={() => setDisconnectOpen(false)}
        onConfirm={() => {
          disconnectDemoWallet();
          setDisconnectOpen(false);
          showToast("Wallet disconnected.", "info");
        }}
        title="Disconnect wallet?"
        description="You can reconnect a demo Stellar wallet at any time."
        confirmLabel="Disconnect"
      />
    </div>
  );
}
