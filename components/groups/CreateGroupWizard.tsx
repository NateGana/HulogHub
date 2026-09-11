"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { GroupPurpose, ContributionFrequency } from "@/types";
import { peso, formatDate, addDays } from "@/lib/utils";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/hooks/use-toast";
import { Check, Plus, Trash2, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";

const PURPOSES: GroupPurpose[] = ["Emergency Fund", "Travel", "Education", "Business", "General Savings"];
const FREQUENCIES: { value: ContributionFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";
const labelClass = "mb-1.5 block text-xs font-semibold text-foreground";

export function CreateGroupWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { createGroup } = useAppData();
  const { showToast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState<GroupPurpose>("General Savings");

  const [amount, setAmount] = useState(1500);
  const [frequency, setFrequency] = useState<ContributionFrequency>("monthly");
  const [memberCount, setMemberCount] = useState(5);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));

  const [memberNames, setMemberNames] = useState<string[]>(["", "", "", "", ""]);
  const [payoutOrder, setPayoutOrder] = useState<number[]>([0, 1, 2, 3, 4]);

  const [submitting, setSubmitting] = useState(false);

  function resetAndClose() {
    setStep(1);
    setName("");
    setDescription("");
    setPurpose("General Savings");
    setAmount(1500);
    setFrequency("monthly");
    setMemberCount(5);
    setMemberNames(["", "", "", "", ""]);
    setPayoutOrder([0, 1, 2, 3, 4]);
    onClose();
  }

  function syncMemberCount(count: number) {
    setMemberCount(count);
    setMemberNames((prev) => {
      const next = [...prev];
      while (next.length < count) next.push("");
      return next.slice(0, count);
    });
    setPayoutOrder((prev) => {
      const next = prev.filter((i) => i < count);
      for (let i = 0; i < count; i++) if (!next.includes(i)) next.push(i);
      return next;
    });
  }

  function moveOrder(index: number, dir: -1 | 1) {
    setPayoutOrder((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const namedMembers = memberNames.filter((n) => n.trim().length > 0);
  const canProceedStep1 = name.trim().length > 0;
  const canProceedStep2 = amount > 0 && memberCount >= 2;
  const canProceedStep3 = namedMembers.length === memberCount;

  function handleCreate() {
    setSubmitting(true);
    setTimeout(() => {
      const group = createGroup({
        name,
        description,
        purpose,
        contributionAmount: amount,
        frequency,
        totalCycles: memberCount,
        startDate: new Date(startDate).toISOString(),
        memberNames,
        payoutOrderIndexes: payoutOrder,
      });
      setSubmitting(false);
      showToast("Group created successfully.", "success");
      resetAndClose();
      router.push(`/groups/${group.id}`);
    }, 500);
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Create Savings Group" maxWidth="max-w-xl">
      {/* Stepper */}
      <div className="mb-6 flex items-center gap-2">
        {["Group Info", "Contribution", "Payout Order", "Review"].map((label, i) => {
          const idx = i + 1;
          const active = idx === step;
          const done = idx < step;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-primary-700 text-white"
                    : active
                      ? "border-2 border-primary-700 text-primary-700"
                      : "border border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : idx}
              </div>
              {idx < 4 && <div className={`h-0.5 flex-1 ${done ? "bg-primary-700" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Group Name</label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Barkada Savings Circle" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group saving for?"
            />
          </div>
          <div>
            <label className={labelClass}>Group Purpose</label>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    purpose === p
                      ? "border-primary-700 bg-primary-700 text-white"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Contribution Amount (₱)</label>
            <input
              type="number"
              min={100}
              className={inputClass}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelClass}>Frequency</label>
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFrequency(f.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    frequency === f.value
                      ? "border-primary-700 bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Number of Members</label>
              <input
                type="number"
                min={2}
                max={20}
                className={inputClass}
                value={memberCount}
                onChange={(e) => syncMemberCount(Math.max(2, Math.min(20, Number(e.target.value))))}
              />
            </div>
            <div>
              <label className={labelClass}>Start Date</label>
              <input type="date" className={inputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">Enter each member's name, then arrange the payout order below.</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: memberCount }).map((_, i) => (
              <input
                key={i}
                className={inputClass}
                placeholder={`Member ${i + 1} name`}
                value={memberNames[i] ?? ""}
                onChange={(e) => {
                  const next = [...memberNames];
                  next[i] = e.target.value;
                  setMemberNames(next);
                }}
              />
            ))}
          </div>

          {canProceedStep3 && (
            <div>
              <label className={labelClass}>Payout Order</label>
              <div className="space-y-1.5">
                {payoutOrder.map((memberIdx, position) => (
                  <div
                    key={memberIdx}
                    className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-primary-700 dark:text-primary-400">{position + 1}.</span>
                    <span className="flex-1">{memberNames[memberIdx] || `Member ${memberIdx + 1}`}</span>
                    <button
                      onClick={() => moveOrder(position, -1)}
                      disabled={position === 0}
                      className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveOrder(position, 1)}
                      disabled={position === payoutOrder.length - 1}
                      className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3 text-sm">
          {[
            ["Group", name],
            ["Purpose", purpose],
            ["Contribution", `${peso(amount, false)} / ${frequency}`],
            ["Members", String(memberCount)],
            ["Start Date", formatDate(new Date(startDate).toISOString())],
            ["Estimated Payout", peso(amount * memberCount, false)],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {step > 1 && (
          <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {step < 4 && (
          <Button
            className="flex-1"
            onClick={() => setStep((s) => s + 1)}
            disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2) || (step === 3 && !canProceedStep3)}
          >
            Continue
          </Button>
        )}
        {step === 4 && (
          <Button className="flex-1" onClick={handleCreate} loading={submitting}>
            Create Savings Group
          </Button>
        )}
      </div>
    </Modal>
  );
}
