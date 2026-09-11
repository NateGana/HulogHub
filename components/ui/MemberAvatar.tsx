import { cn } from "@/lib/utils";

export function MemberAvatar({
  name,
  initials,
  color,
  size = "md",
  className,
}: {
  name: string;
  initials: string;
  color: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };
  return (
    <div
      title={name}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-card",
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

export function AvatarStack({
  members,
  max = 4,
}: {
  members: { name: string; initials: string; avatarColor: string }[];
  max?: number;
}) {
  const shown = members.slice(0, max);
  const remaining = members.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((m, i) => (
        <MemberAvatar key={i} name={m.name} initials={m.initials} color={m.avatarColor} size="xs" />
      ))}
      {remaining > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-card">
          +{remaining}
        </div>
      )}
    </div>
  );
}
