"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAppData } from "@/context/AppDataContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCircle2 } from "lucide-react";
import { uid } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

export function InviteModal({
  open,
  onClose,
  groupId,
  groupName,
}: {
  open: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
}) {
  const { inviteMember } = useAppData();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [sent, setSent] = useState(false);
  const [link] = useState(() => `https://huloghub.app/invite/${uid("inv")}`);
  const [copied, setCopied] = useState(false);

  function reset() {
    setEmail("");
    setMobile("");
    setSent(false);
    setCopied(false);
    onClose();
  }

  function handleInvite() {
    const name = email.split("@")[0] || mobile || "New Member";
    inviteMember(groupId, name, email || `${mobile}@invite.huloghub`);
    setSent(true);
    showToast("Member invited successfully.", "success");
  }

  return (
    <Modal open={open} onClose={reset} title={sent ? undefined : "Invite Member"} maxWidth="max-w-sm">
      {!sent ? (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">Invite someone to join {groupName}.</p>
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Email</label>
            <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Mobile Number</label>
            <input className={inputClass} value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+63 9XX XXX XXXX" />
          </div>
          <Button className="w-full" disabled={!email && !mobile} onClick={handleInvite}>
            Send Invitation
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className="font-display text-base font-semibold">Invitation Sent</p>
            <p className="mt-1 text-sm text-muted-foreground">Share this invite link directly if needed.</p>
          </div>
          <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
            <span className="flex-1 truncate text-xs text-muted-foreground">{link}</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(link);
                setCopied(true);
                showToast("Invite link copied.", "info");
              }}
              className="shrink-0 rounded-md p-1.5 hover:bg-muted"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <Button variant="outline" className="w-full" onClick={reset}>
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
}
