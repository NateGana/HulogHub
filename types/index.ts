// ============================================================
// HulogHub — Core domain types
// ============================================================

export type GroupStatus = "active" | "completed" | "invited";
export type GroupPurpose =
  | "Emergency Fund"
  | "Travel"
  | "Education"
  | "Business"
  | "General Savings";
export type ContributionFrequency = "weekly" | "biweekly" | "monthly";

export type ContributionStatus = "paid" | "pending" | "late" | "verified";
export type PayoutStatus = "upcoming" | "processing" | "completed" | "failed";
export type TransactionType = "contribution" | "payout" | "transfer" | "fee";
export type TransactionStatus = "verified" | "pending" | "failed";
export type MemberRole = "admin" | "member";
export type NotificationType =
  | "contribution"
  | "payout"
  | "group"
  | "security"
  | "blockchain";
export type ThemePreference = "light" | "dark" | "system";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatarColor: string;
  initials: string;
}

export interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  role: MemberRole;
  payoutPosition: number;
  totalContributed: number;
  lastPaymentDate: string | null;
  status: "active" | "inactive";
}

export interface Group {
  id: string;
  name: string;
  description: string;
  purpose: GroupPurpose;
  contributionAmount: number;
  frequency: ContributionFrequency;
  memberIds: string[];
  payoutOrder: string[]; // member ids, in payout order
  currentCycle: number;
  totalCycles: number;
  startDate: string;
  status: GroupStatus;
  progress: number; // 0-100
  nextContributionDate: string;
  nextPayoutDate: string;
  nextPayoutMemberId: string | null;
  createdAt: string;
}

export interface Contribution {
  id: string;
  groupId: string;
  memberId: string;
  amount: number;
  date: string;
  cycle: number;
  status: ContributionStatus;
  transactionId: string | null;
}

export interface Payout {
  id: string;
  groupId: string;
  recipientMemberId: string;
  amount: number;
  scheduledDate: string;
  completedDate: string | null;
  status: PayoutStatus;
  cycle: number;
  transactionId: string | null;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  groupId: string | null;
  amount: number; // negative for outgoing (contributions), positive for incoming (payouts)
  date: string;
  status: TransactionStatus;
  stellarLedger: string | null;
  stellarHash: string | null;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  availableBalance: number;
  pendingBalance: number;
  totalContributions: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SavingsPoint {
  label: string;
  value: number;
}

export interface AppSettings {
  fullName: string;
  email: string;
  mobile: string;
  currency: "PHP";
  language: "English";
  timezone: "Asia/Manila";
  theme: ThemePreference;
  notifications: {
    contributionReminders: boolean;
    payoutNotifications: boolean;
    groupActivity: boolean;
    blockchainVerification: boolean;
  };
}

export interface AppDataShape {
  currentUser: User;
  members: Member[];
  groups: Group[];
  contributions: Contribution[];
  payouts: Payout[];
  transactions: Transaction[];
  notifications: Notification[];
  wallet: WalletState;
  settings: AppSettings;
}
