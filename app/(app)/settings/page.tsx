"use client";

import { useState } from "react";
import { User, Bell, Shield, Palette, Sliders, RotateCcw } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { CardSkeleton } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { useToast } from "@/hooks/use-toast";
import { ThemePreference } from "@/types";

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20";

function SectionCard({ icon: Icon, title, description, children }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { data, loading, updateSettings, resetDemoData } = useAppData();
  const { showToast } = useToast();
  const [resetOpen, setResetOpen] = useState(false);

  if (loading || !data) return <CardSkeleton className="h-96" />;

  const { settings } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, preferences, and security.</p>
      </div>

      <SectionCard icon={User} title="Profile">
        <div className="mb-5 flex items-center gap-4">
          <MemberAvatar name={settings.fullName} initials={data.currentUser.initials} color={data.currentUser.avatarColor} size="lg" />
          <Button variant="outline" size="sm">Change Photo</Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Full Name</label>
            <input className={inputClass} defaultValue={settings.fullName} onBlur={(e) => updateSettings({ fullName: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Email</label>
            <input className={inputClass} defaultValue={settings.email} onBlur={(e) => updateSettings({ email: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Mobile Number</label>
            <input className={inputClass} defaultValue={settings.mobile} onBlur={(e) => updateSettings({ mobile: e.target.value })} />
          </div>
        </div>
        <Button className="mt-5" size="sm" onClick={() => showToast("Settings updated.", "success")}>
          Save Changes
        </Button>
      </SectionCard>

      <SectionCard icon={Sliders} title="Preferences">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Currency</label>
            <input className={inputClass} value="PHP ₱" disabled />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Language</label>
            <input className={inputClass} value="English" disabled />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold">Timezone</label>
            <input className={inputClass} value="Asia/Manila" disabled />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Bell} title="Notifications">
        <div className="space-y-4">
          {[
            { key: "contributionReminders", label: "Contribution reminders" },
            { key: "payoutNotifications", label: "Payout notifications" },
            { key: "groupActivity", label: "Group activity" },
            { key: "blockchainVerification", label: "Blockchain verification" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.label}</span>
              <Switch
                checked={(settings.notifications as any)[item.key]}
                onCheckedChange={(v) => {
                  updateSettings({ notifications: { ...settings.notifications, [item.key]: v } });
                  showToast("Settings updated.", "success");
                }}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Shield} title="Security">
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">Change Password</Button>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch checked={false} onCheckedChange={() => showToast("Two-factor authentication is a demo placeholder.", "info")} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Active sessions</p>
              <p className="text-xs text-muted-foreground">1 device currently signed in</p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Palette} title="Appearance">
        <div className="flex gap-2">
          {(["light", "dark", "system"] as ThemePreference[]).map((t) => (
            <button
              key={t}
              onClick={() => updateSettings({ theme: t })}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                settings.theme === t
                  ? "border-primary-700 bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={RotateCcw} title="Demo Data">
        <p className="mb-4 text-sm text-muted-foreground">
          Reset HulogHub back to its original demo state. This clears everything you've created
          in this browser and restores the sample groups and transactions.
        </p>
        <Button variant="outline" onClick={() => setResetOpen(true)}>
          Reset Demo Data
        </Button>
      </SectionCard>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetDemoData();
          setResetOpen(false);
          showToast("Demo data has been reset.", "success");
        }}
        title="Reset all demo data?"
        description="This restores the original sample groups, members, and transactions, and cannot be undone."
        confirmLabel="Reset Data"
        danger
      />
    </div>
  );
}
