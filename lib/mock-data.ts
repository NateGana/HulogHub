// ============================================================
// lib/mock-data.ts
//
// Realistic Philippine-oriented seed data used the first time
// the app runs (before anything is saved to localStorage).
// ============================================================

import {
  AppDataShape,
  Contribution,
  Group,
  Member,
  Notification,
  Payout,
  Transaction,
} from "@/types";
import { addDays, initialsOf, uid } from "./utils";

const AVATAR_COLORS = [
  "#0F766E", "#B45309", "#1D4ED8", "#BE185D", "#4D7C0F", "#6D28D9",
];

function today(): string {
  return new Date().toISOString();
}

function makeMember(
  name: string,
  role: "admin" | "member",
  payoutPosition: number,
  totalContributed: number,
  lastPaymentDaysAgo: number | null,
): Member {
  return {
    id: uid("mem"),
    userId: uid("usr"),
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    avatarColor: AVATAR_COLORS[payoutPosition % AVATAR_COLORS.length],
    initials: initialsOf(name),
    role,
    payoutPosition,
    totalContributed,
    lastPaymentDate: lastPaymentDaysAgo === null ? null : addDays(today(), -lastPaymentDaysAgo),
    status: "active",
  };
}

export function buildSeedData(): AppDataShape {
  const maria = makeMember("Maria Santos", "admin", 1, 7500, 1);
  const juan = makeMember("Juan Dela Cruz", "member", 2, 6000, 1);
  const ana = makeMember("Ana Reyes", "member", 3, 4500, 9);
  const carlo = makeMember("Carlo Mendoza", "member", 4, 6000, 1);
  const sofia = makeMember("Sofia Garcia", "member", 5, 6000, 1);
  const miguel = makeMember("Miguel Ramos", "member", 6, 3000, 1);

  const members: Member[] = [maria, juan, ana, carlo, sofia, miguel];

  const barkadaMembers = [maria, juan, ana, carlo, sofia, miguel, maria, juan].slice(0, 8);
  const barkadaIds = [maria.id, juan.id, ana.id, carlo.id, sofia.id, miguel.id];

  const groupBarkada: Group = {
    id: uid("grp"),
    name: "Barkada Savings Circle",
    description: "Monthly savings circle for the barkada — emergency-ready and goal-driven.",
    purpose: "General Savings",
    contributionAmount: 1500,
    frequency: "monthly",
    memberIds: barkadaIds,
    payoutOrder: barkadaIds,
    currentCycle: 5,
    totalCycles: 8,
    startDate: addDays(today(), -120),
    status: "active",
    progress: 68,
    nextContributionDate: addDays(today(), 6),
    nextPayoutDate: addDays(today(), 22),
    nextPayoutMemberId: ana.id,
    createdAt: addDays(today(), -120),
  };

  const groupOffice: Group = {
    id: uid("grp"),
    name: "Office Ipon Club",
    description: "Workplace paluwagan for the finance & ops team.",
    purpose: "General Savings",
    contributionAmount: 2000,
    frequency: "monthly",
    memberIds: [maria.id, juan.id, carlo.id, sofia.id, miguel.id],
    payoutOrder: [juan.id, maria.id, sofia.id, carlo.id, miguel.id],
    currentCycle: 3,
    totalCycles: 12,
    startDate: addDays(today(), -90),
    status: "active",
    progress: 45,
    nextContributionDate: addDays(today(), 14),
    nextPayoutDate: addDays(today(), 14),
    nextPayoutMemberId: sofia.id,
    createdAt: addDays(today(), -90),
  };

  const groupFamily: Group = {
    id: uid("grp"),
    name: "Family Emergency Fund",
    description: "Shared emergency fund among immediate family members.",
    purpose: "Emergency Fund",
    contributionAmount: 1000,
    frequency: "monthly",
    memberIds: [maria.id, ana.id, carlo.id, sofia.id, miguel.id, juan.id],
    payoutOrder: [maria.id, ana.id, carlo.id, sofia.id, miguel.id, juan.id],
    currentCycle: 6,
    totalCycles: 6,
    startDate: addDays(today(), -160),
    status: "active",
    progress: 82,
    nextContributionDate: addDays(today(), 3),
    nextPayoutDate: addDays(today(), 30),
    nextPayoutMemberId: carlo.id,
    createdAt: addDays(today(), -160),
  };

  const groupTravel: Group = {
    id: uid("grp"),
    name: "Travel Goals 2026",
    description: "Saving up together for a group trip.",
    purpose: "Travel",
    contributionAmount: 2500,
    frequency: "monthly",
    memberIds: [juan.id, ana.id, sofia.id],
    payoutOrder: [juan.id, ana.id, sofia.id],
    currentCycle: 1,
    totalCycles: 3,
    startDate: addDays(today(), -10),
    status: "invited",
    progress: 12,
    nextContributionDate: addDays(today(), 20),
    nextPayoutDate: addDays(today(), 50),
    nextPayoutMemberId: juan.id,
    createdAt: addDays(today(), -10),
  };

  const groups = [groupBarkada, groupOffice, groupFamily, groupTravel];

  const transactions: Transaction[] = [];
  const contributions: Contribution[] = [];
  const payouts: Payout[] = [];

  function addContribution(group: Group, member: Member, daysAgo: number, status: Contribution["status"]) {
    const txId = uid("HUL");
    contributions.push({
      id: uid("con"),
      groupId: group.id,
      memberId: member.id,
      amount: group.contributionAmount,
      date: addDays(today(), -daysAgo),
      cycle: group.currentCycle,
      status,
      transactionId: status === "pending" ? null : txId,
    });
    if (status !== "pending") {
      transactions.push({
        id: txId,
        type: "contribution",
        description: `Monthly Contribution`,
        groupId: group.id,
        amount: -group.contributionAmount,
        date: addDays(today(), -daysAgo),
        status: status === "verified" ? "verified" : "pending",
        stellarLedger: `Demo Ledger #${40000000 + Math.floor(Math.random() * 900000)}`,
        stellarHash: generateHash(),
      });
    }
  }

  addContribution(groupBarkada, maria, 1, "verified");
  addContribution(groupBarkada, juan, 1, "verified");
  addContribution(groupBarkada, ana, 0, "pending");
  addContribution(groupBarkada, carlo, 1, "verified");
  addContribution(groupBarkada, sofia, 1, "verified");
  addContribution(groupBarkada, miguel, 1, "verified");

  addContribution(groupOffice, maria, 5, "verified");
  addContribution(groupOffice, juan, 5, "verified");
  addContribution(groupOffice, carlo, 2, "late");
  addContribution(groupOffice, sofia, 5, "verified");
  addContribution(groupOffice, miguel, 5, "verified");

  addContribution(groupFamily, maria, 3, "verified");
  addContribution(groupFamily, ana, 3, "verified");
  addContribution(groupFamily, carlo, 3, "verified");
  addContribution(groupFamily, sofia, 3, "verified");
  addContribution(groupFamily, miguel, 3, "verified");
  addContribution(groupFamily, juan, 3, "verified");

  payouts.push(
    {
      id: uid("pay"),
      groupId: groupBarkada.id,
      recipientMemberId: maria.id,
      amount: groupBarkada.contributionAmount * groupBarkada.memberIds.length,
      scheduledDate: addDays(today(), -90),
      completedDate: addDays(today(), -90),
      status: "completed",
      cycle: 1,
      transactionId: uid("HUL"),
    },
    {
      id: uid("pay"),
      groupId: groupBarkada.id,
      recipientMemberId: juan.id,
      amount: groupBarkada.contributionAmount * groupBarkada.memberIds.length,
      scheduledDate: addDays(today(), -60),
      completedDate: addDays(today(), -60),
      status: "completed",
      cycle: 2,
      transactionId: uid("HUL"),
    },
    {
      id: uid("pay"),
      groupId: groupBarkada.id,
      recipientMemberId: ana.id,
      amount: groupBarkada.contributionAmount * groupBarkada.memberIds.length,
      scheduledDate: addDays(today(), 22),
      completedDate: null,
      status: "upcoming",
      cycle: 5,
      transactionId: null,
    },
    {
      id: uid("pay"),
      groupId: groupBarkada.id,
      recipientMemberId: carlo.id,
      amount: groupBarkada.contributionAmount * groupBarkada.memberIds.length,
      scheduledDate: addDays(today(), 52),
      completedDate: null,
      status: "upcoming",
      cycle: 6,
      transactionId: null,
    },
    {
      id: uid("pay"),
      groupId: groupOffice.id,
      recipientMemberId: sofia.id,
      amount: groupOffice.contributionAmount * groupOffice.memberIds.length,
      scheduledDate: addDays(today(), 14),
      completedDate: null,
      status: "upcoming",
      cycle: 3,
      transactionId: null,
    },
  );

  // Payout transactions for completed payouts
  for (const p of payouts.filter((p) => p.status === "completed")) {
    transactions.push({
      id: p.transactionId as string,
      type: "payout",
      description: "Group Payout",
      groupId: p.groupId,
      amount: p.amount,
      date: p.completedDate as string,
      status: "verified",
      stellarLedger: `Demo Ledger #${40000000 + Math.floor(Math.random() * 900000)}`,
      stellarHash: generateHash(),
    });
  }

  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const notifications: Notification[] = [
    {
      id: uid("ntf"),
      type: "contribution",
      title: "Contribution due soon",
      message: "Your ₱1,500 contribution to Barkada Savings Circle is due in 6 days.",
      date: addDays(today(), 0),
      read: false,
    },
    {
      id: uid("ntf"),
      type: "blockchain",
      title: "Contribution verified",
      message: "Your last contribution to Family Emergency Fund was verified on Stellar (Demo).",
      date: addDays(today(), -3),
      read: false,
    },
    {
      id: uid("ntf"),
      type: "group",
      title: "New member joined",
      message: "Miguel Ramos joined Office Ipon Club.",
      date: addDays(today(), -5),
      read: true,
    },
    {
      id: uid("ntf"),
      type: "payout",
      title: "Payout scheduled",
      message: "Ana Reyes's payout for Barkada Savings Circle is scheduled for " +
        new Date(addDays(today(), 22)).toLocaleDateString("en-US", { month: "long", day: "numeric" }) + ".",
      date: addDays(today(), -1),
      read: false,
    },
    {
      id: uid("ntf"),
      type: "security",
      title: "New login detected",
      message: "Your account was accessed from a new device.",
      date: addDays(today(), -8),
      read: true,
    },
  ];

  return {
    currentUser: {
      id: maria.userId,
      name: "Maria Santos",
      email: "maria.santos@example.com",
      mobile: "+63 917 000 1234",
      avatarColor: maria.avatarColor,
      initials: "MS",
    },
    members,
    groups,
    contributions,
    payouts,
    transactions,
    notifications,
    wallet: {
      connected: false,
      address: null,
      availableBalance: 24850,
      pendingBalance: 1500,
      totalContributions: 18500,
    },
    settings: {
      fullName: "Maria Santos",
      email: "maria.santos@example.com",
      mobile: "+63 917 000 1234",
      currency: "PHP",
      language: "English",
      timezone: "Asia/Manila",
      theme: "system",
      notifications: {
        contributionReminders: true,
        payoutNotifications: true,
        groupActivity: true,
        blockchainVerification: true,
      },
    },
  };
}

function generateHash(): string {
  const chars = "abcdef0123456789";
  let s = "";
  for (let i = 0; i < 64; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function buildSavingsHistory(totalSaved: number): { label: string; value: number }[] {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const ratios = [0.28, 0.4, 0.52, 0.68, 0.84, 1];
  return months.map((label, i) => ({
    label,
    value: Math.round(totalSaved * ratios[i]),
  }));
}
