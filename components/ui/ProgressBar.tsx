import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  barClassName,
  size = "md",
}: {
  value: number;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-muted",
        size === "sm" ? "h-1.5" : "h-2",
        className,
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-500 ease-out",
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
