"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Group } from "@/types";
import { peso, formatDate, truncateHash } from "@/lib/utils";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/hooks/use-toast";
import { Wallet2, Landmark, CheckCircle2, Loader2 } from "lucide-react";

type Step = "review" | "confirming" | "verifying" | "done";

export function ContributeModal({
  open,
  onClose,
  group,
  memberId,
}: {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  memberId: string;
}) {
  const { recordContribution } = useAppData();
  const { showToast } = useToast();
  const [method, setMethod] = useState<"wallet" | "stellar">("wallet");
  const [step, setStep] = useState<Step>("review");
  const [hash, setHash] = useState<string | null>(null);

  if (!group) return null;

  function reset() {
    setStep("review");
    setMethod("wallet");
    setHash(null);
    onClose();
  }

  async function handleConfirm() {
    if (!group) return;
    setStep("confirming");
    const contribution = await recordContribution(group.id, memberId, method);
    setHash(contribution.transactionId);
    setStep("verifying");
    setTimeout(() => {
      setStep("done");
      showToast("Contribution recorded successfully.", "success");
    }, 1600);
  }

  return (
    <Modal open={open} onClose={reset} title={step === "review" ? "Make Contribution" : undefined} maxWidth="max-w-md">
      {step === "review" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground">{group.name}</p>
            <p className="mt-1 font-display text-2xl font-bold tabular">{peso(group.contributionAmount)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Due date: {formatDate(group.nextContributionDate)}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-foreground">Payment method</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMethod("wallet")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-sm font-medium transition-colors ${
                  method === "wallet" ? "border-primary-700 bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300" : "border-border hover:bg-muted"
                }`}
              >
                <Wallet2 className="h-5 w-5" />
                HulogHub Wallet
              </button>
              <button
                onClick={() => setMethod("stellar")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-sm font-medium transition-colors ${
                  method === "stellar" ? "border-primary-700 bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300" : "border-border hover:bg-muted"
                }`}
              >
                <Landmark className="h-5 w-5" />
                Stellar Wallet
              </button>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Demo Mode: this contribution will be simulated and associated with a demo Stellar record — not a live network transaction.
          </p>

          <Button className="w-full" onClick={handleConfirm}>
            Confirm Contribution
          </Button>
        </div>
      )}

      {step === "confirming" && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <div>
            <p className="font-display text-base font-semibold">Contribution Submitted</p>
            <p className="mt-1 text-sm text-muted-foreground">Sending to the demo Stellar network...</p>
          </div>
        </div>
      )}

      {step === "verifying" && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Pending</span>
            <span className="text-muted-foreground">→</span>
            <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
            <span className="text-muted-foreground">Verified</span>
          </div>
          <p className="text-xs text-muted-foreground">Blockchain Verification in progress (Demo Mode)</p>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className="font-display text-base font-semibold">Contribution Verified</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {peso(group.contributionAmount)} to {group.name}
            </p>
            {hash && <p className="mt-2 font-mono text-xs text-muted-foreground">Tx: {truncateHash(hash)}</p>}
          </div>
          <Button className="w-full" onClick={reset}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
}
