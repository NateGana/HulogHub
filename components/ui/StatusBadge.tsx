import { cn } from "@/lib/utils";
import {
  ContributionStatus,
  GroupStatus,
  PayoutStatus,
  TransactionStatus,
} from "@/types";

type AnyStatus = ContributionStatus | GroupStatus | PayoutStatus | TransactionStatus | "active" | "inactive";

const STYLES: Record<string, string> = {
  paid: "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800",
  verified: "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800",
  active: "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800",
  completed: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  processing: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  upcoming: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  invited: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  late: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  failed: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  inactive: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

const LABELS: Record<string, string> = {
  paid: "Paid",
  verified: "Verified",
  active: "Active",
  completed: "Completed",
  pending: "Pending",
  processing: "Processing",
  upcoming: "Upcoming",
  invited: "Invited",
  late: "Late",
  failed: "Failed",
  inactive: "Inactive",
};

export function StatusBadge({ status, className }: { status: AnyStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        STYLES[status] ?? "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {LABELS[status] ?? status}
    </span>
  );
}
