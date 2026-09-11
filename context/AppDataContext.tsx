"use client";

// ============================================================
// context/AppDataContext.tsx
//
// Single source of truth for all HulogHub application state.
// Backed by localStorage via lib/api.ts + lib/storage.ts so
// changes persist across refreshes. Any component can read
// state and call actions via the useAppData() hook.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AppDataShape,
  AppSettings,
  Contribution,
  ContributionFrequency,
  Group,
  GroupPurpose,
  Member,
  Notification,
  Payout,
  Transaction,
} from "@/types";
import { loadAppData, persistAppData, resetAppData } from "@/lib/api";
import { addDays, initialsOf, uid } from "@/lib/utils";
import * as stellar from "@/lib/stellar";

interface CreateGroupInput {
  name: string;
  description: string;
  purpose: GroupPurpose;
  contributionAmount: number;
  frequency: ContributionFrequency;
  totalCycles: number;
  startDate: string;
  memberNames: string[]; // simple names entered in the wizard
  payoutOrderIndexes: number[]; // indexes into memberNames, in payout order
}

interface AppDataContextValue {
  data: AppDataShape | null;
  loading: boolean;

  // Derived / computed
  totalSaved: number;
  activeGroupsCount: number;
  upcomingContribution: { amount: number; date: string } | null;
  nextPayout: { amount: number; date: string; groupName: string } | null;
  unreadNotificationCount: number;

  // Groups
  createGroup: (input: CreateGroupInput) => Group;
  deleteGroup: (groupId: string) => void;
  updateGroup: (groupId: string, patch: Partial<Group>) => void;

  // Members
  inviteMember: (groupId: string, name: string, email: string) => void;
  removeMember: (groupId: string, memberId: string) => void;
  changeMemberRole: (memberId: string, role: Member["role"]) => void;

  // Contributions
  recordContribution: (groupId: string, memberId: string, method: "wallet" | "stellar") => Promise<Contribution>;
  markContributionPaid: (contributionId: string) => void;

  // Payouts
  updatePayoutStatus: (payoutId: string, status: Payout["status"]) => void;

  // Wallet
  connectDemoWallet: () => Promise<void>;
  disconnectDemoWallet: () => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Settings
  updateSettings: (patch: Partial<AppSettings>) => void;

  // Reset (demo utility)
  resetDemoData: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppDataShape | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadAppData().then((loaded) => {
      if (mounted) {
        setData(loaded);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Persist on every change (after initial load).
  useEffect(() => {
    if (data) persistAppData(data);
  }, [data]);

  const update = useCallback((updater: (prev: AppDataShape) => AppDataShape) => {
    setData((prev) => (prev ? updater(prev) : prev));
  }, []);

  // ---------------------------- Groups ----------------------------

  const createGroup = useCallback(
    (input: CreateGroupInput): Group => {
      let createdGroup!: Group;
      update((prev) => {
        const newMembers: Member[] = input.memberNames.map((name, idx) => ({
          id: uid("mem"),
          userId: uid("usr"),
          name,
          email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          avatarColor: ["#0F766E", "#B45309", "#1D4ED8", "#BE185D", "#4D7C0F", "#6D28D9"][idx % 6],
          initials: initialsOf(name),
          role: idx === 0 ? "admin" : "member",
          payoutPosition: idx + 1,
          totalContributed: 0,
          lastPaymentDate: null,
          status: "active",
        }));

        const payoutOrder =
          input.payoutOrderIndexes.length === newMembers.length
            ? input.payoutOrderIndexes.map((i) => newMembers[i].id)
            : newMembers.map((m) => m.id);

        const group: Group = {
          id: uid("grp"),
          name: input.name,
          description: input.description,
          purpose: input.purpose,
          contributionAmount: input.contributionAmount,
          frequency: input.frequency,
          memberIds: newMembers.map((m) => m.id),
          payoutOrder,
          currentCycle: 1,
          totalCycles: input.totalCycles,
          startDate: input.startDate,
          status: "active",
          progress: 0,
          nextContributionDate: input.startDate,
          nextPayoutDate: addDays(input.startDate, 30),
          nextPayoutMemberId: payoutOrder[0] ?? null,
          createdAt: new Date().toISOString(),
        };

        createdGroup = group;

        const notification: Notification = {
          id: uid("ntf"),
          type: "group",
          title: "Group created",
          message: `${group.name} was created successfully.`,
          date: new Date().toISOString(),
          read: false,
        };

        return {
          ...prev,
          members: [...prev.members, ...newMembers],
          groups: [group, ...prev.groups],
          notifications: [notification, ...prev.notifications],
        };
      });
      return createdGroup;
    },
    [update],
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      update((prev) => ({
        ...prev,
        groups: prev.groups.filter((g) => g.id !== groupId),
        contributions: prev.contributions.filter((c) => c.groupId !== groupId),
        payouts: prev.payouts.filter((p) => p.groupId !== groupId),
      }));
    },
    [update],
  );

  const updateGroup = useCallback(
    (groupId: string, patch: Partial<Group>) => {
      update((prev) => ({
        ...prev,
        groups: prev.groups.map((g) => (g.id === groupId ? { ...g, ...patch } : g)),
      }));
    },
    [update],
  );

  // ---------------------------- Members ----------------------------

  const inviteMember = useCallback(
    (groupId: string, name: string, email: string) => {
      update((prev) => {
        const newMember: Member = {
          id: uid("mem"),
          userId: uid("usr"),
          name,
          email,
          avatarColor: "#0F766E",
          initials: initialsOf(name || email),
          role: "member",
          payoutPosition: (prev.groups.find((g) => g.id === groupId)?.memberIds.length ?? 0) + 1,
          totalContributed: 0,
          lastPaymentDate: null,
          status: "active",
        };
        const notification: Notification = {
          id: uid("ntf"),
          type: "group",
          title: "Invitation sent",
          message: `${name || email} was invited to join the group.`,
          date: new Date().toISOString(),
          read: false,
        };
        return {
          ...prev,
          members: [...prev.members, newMember],
          groups: prev.groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  memberIds: [...g.memberIds, newMember.id],
                  payoutOrder: [...g.payoutOrder, newMember.id],
                }
              : g,
          ),
          notifications: [notification, ...prev.notifications],
        };
      });
    },
    [update],
  );

  const removeMember = useCallback(
    (groupId: string, memberId: string) => {
      update((prev) => ({
        ...prev,
        groups: prev.groups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                memberIds: g.memberIds.filter((id) => id !== memberId),
                payoutOrder: g.payoutOrder.filter((id) => id !== memberId),
              }
            : g,
        ),
      }));
    },
    [update],
  );

  const changeMemberRole = useCallback(
    (memberId: string, role: Member["role"]) => {
      update((prev) => ({
        ...prev,
        members: prev.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
      }));
    },
    [update],
  );

  // ---------------------------- Contributions ----------------------------

  const recordContribution = useCallback(
    async (groupId: string, memberId: string, method: "wallet" | "stellar"): Promise<Contribution> => {
      const group = data?.groups.find((g) => g.id === groupId);
      const amount = group?.contributionAmount ?? 0;

      const contributionId = uid("con");
      const provisional: Contribution = {
        id: contributionId,
        groupId,
        memberId,
        amount,
        date: new Date().toISOString(),
        cycle: group?.currentCycle ?? 1,
        status: "pending",
        transactionId: null,
      };

      update((prev) => ({
        ...prev,
        contributions: [provisional, ...prev.contributions],
        wallet: {
          ...prev.wallet,
          pendingBalance: prev.wallet.pendingBalance + amount,
        },
      }));

      // Submit to the demo Stellar service, then verify asynchronously.
      const record = await stellar.createContributionTransaction({ groupId, memberId, amount });

      update((prev) => ({
        ...prev,
        contributions: prev.contributions.map((c) =>
          c.id === contributionId ? { ...c, status: "paid", transactionId: record.hash } : c,
        ),
        transactions: [
          {
            id: uid("HUL"),
            type: "contribution",
            description: "Monthly Contribution",
            groupId,
            amount: -amount,
            date: new Date().toISOString(),
            status: "pending",
            stellarLedger: `Demo Ledger #${record.ledger}`,
            stellarHash: record.hash,
          },
          ...prev.transactions,
        ],
      }));

      await stellar.verifyTransaction(record.hash);

      update((prev) => {
        const groupObj = prev.groups.find((g) => g.id === groupId);
        const newTotalMemberContrib =
          (prev.members.find((m) => m.id === memberId)?.totalContributed ?? 0) + amount;

        return {
          ...prev,
          contributions: prev.contributions.map((c) =>
            c.id === contributionId ? { ...c, status: "verified" } : c,
          ),
          transactions: prev.transactions.map((t) =>
            t.stellarHash === record.hash ? { ...t, status: "verified" } : t,
          ),
          members: prev.members.map((m) =>
            m.id === memberId
              ? { ...m, totalContributed: newTotalMemberContrib, lastPaymentDate: new Date().toISOString() }
              : m,
          ),
          groups: groupObj
            ? prev.groups.map((g) =>
                g.id === groupId
                  ? {
                      ...g,
                      progress: Math.min(100, Math.round(((g.currentCycle - 1 + 1 / (g.memberIds.length || 1)) / g.totalCycles) * 100)),
                    }
                  : g,
              )
            : prev.groups,
          wallet: {
            ...prev.wallet,
            pendingBalance: Math.max(0, prev.wallet.pendingBalance - amount),
            totalContributions: prev.wallet.totalContributions + amount,
            availableBalance:
              method === "wallet"
                ? Math.max(0, prev.wallet.availableBalance - amount)
                : prev.wallet.availableBalance,
          },
          notifications: [
            {
              id: uid("ntf"),
              type: "blockchain",
              title: "Contribution verified",
              message: `Your contribution to ${groupObj?.name ?? "your group"} was verified on Stellar (Demo).`,
              date: new Date().toISOString(),
              read: false,
            },
            ...prev.notifications,
          ],
        };
      });

      return provisional;
    },
    [data, update],
  );

  const markContributionPaid = useCallback(
    (contributionId: string) => {
      update((prev) => ({
        ...prev,
        contributions: prev.contributions.map((c) =>
          c.id === contributionId ? { ...c, status: "paid" } : c,
        ),
      }));
    },
    [update],
  );

  // ---------------------------- Payouts ----------------------------

  const updatePayoutStatus = useCallback(
    (payoutId: string, status: Payout["status"]) => {
      update((prev) => ({
        ...prev,
        payouts: prev.payouts.map((p) =>
          p.id === payoutId
            ? { ...p, status, completedDate: status === "completed" ? new Date().toISOString() : p.completedDate }
            : p,
        ),
      }));
    },
    [update],
  );

  // ---------------------------- Wallet ----------------------------

  const connectDemoWallet = useCallback(async () => {
    const account = await stellar.connectWallet();
    update((prev) => ({
      ...prev,
      wallet: { ...prev.wallet, connected: true, address: account.address },
      notifications: [
        {
          id: uid("ntf"),
          type: "blockchain",
          title: "Wallet connected",
          message: "Your Stellar demo wallet is now connected.",
          date: new Date().toISOString(),
          read: false,
        },
        ...prev.notifications,
      ],
    }));
  }, [update]);

  const disconnectDemoWallet = useCallback(() => {
    update((prev) => ({
      ...prev,
      wallet: { ...prev.wallet, connected: false, address: null },
    }));
  }, [update]);

  // ---------------------------- Notifications ----------------------------

  const markNotificationRead = useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }));
    },
    [update],
  );

  const markAllNotificationsRead = useCallback(() => {
    update((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, [update]);

  const clearNotifications = useCallback(() => {
    update((prev) => ({ ...prev, notifications: [] }));
  }, [update]);

  // ---------------------------- Settings ----------------------------

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      update((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
    },
    [update],
  );

  const resetDemoData = useCallback(() => {
    const fresh = resetAppData();
    setData(fresh);
  }, []);

  // ---------------------------- Derived values ----------------------------

  const totalSaved = useMemo(
    () => data?.transactions.filter((t) => t.type === "contribution" && t.status === "verified")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) ?? 0,
    [data],
  );

  const activeGroupsCount = useMemo(
    () => data?.groups.filter((g) => g.status === "active").length ?? 0,
    [data],
  );

  const upcomingContribution = useMemo(() => {
    if (!data || data.groups.length === 0) return null;
    const sorted = [...data.groups]
      .filter((g) => g.status === "active")
      .sort((a, b) => new Date(a.nextContributionDate).getTime() - new Date(b.nextContributionDate).getTime());
    const next = sorted[0];
    if (!next) return null;
    return { amount: next.contributionAmount, date: next.nextContributionDate };
  }, [data]);

  const nextPayout = useMemo(() => {
    if (!data) return null;
    const upcoming = data.payouts
      .filter((p) => p.status === "upcoming")
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0];
    if (!upcoming) return null;
    const group = data.groups.find((g) => g.id === upcoming.groupId);
    return { amount: upcoming.amount, date: upcoming.scheduledDate, groupName: group?.name ?? "" };
  }, [data]);

  const unreadNotificationCount = useMemo(
    () => data?.notifications.filter((n) => !n.read).length ?? 0,
    [data],
  );

  const value: AppDataContextValue = {
    data,
    loading,
    totalSaved,
    activeGroupsCount,
    upcomingContribution,
    nextPayout,
    unreadNotificationCount,
    createGroup,
    deleteGroup,
    updateGroup,
    inviteMember,
    removeMember,
    changeMemberRole,
    recordContribution,
    markContributionPaid,
    updatePayoutStatus,
    connectDemoWallet,
    disconnectDemoWallet,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    updateSettings,
    resetDemoData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
