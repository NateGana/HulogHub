import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardCard({
  label,
  value,
  delta,
  deltaTone = "positive",
  icon: Icon,
  iconClassName,
  sub,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconClassName?: string;
  sub?: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
            iconClassName,
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-bold tabular tracking-tight text-foreground sm:text-[28px]">
        {value}
      </p>
      {(delta || sub) && (
        <p className="mt-1.5 text-xs font-medium">
          {delta && (
            <span
              className={cn(
                deltaTone === "positive" && "text-primary-600 dark:text-primary-400",
                deltaTone === "negative" && "text-danger",
                deltaTone === "neutral" && "text-muted-foreground",
              )}
            >
              {delta}
            </span>
          )}
          {delta && sub && <span className="text-muted-foreground"> · </span>}
          {sub && <span className="text-muted-foreground">{sub}</span>}
        </p>
      )}
    </div>
  );
}
