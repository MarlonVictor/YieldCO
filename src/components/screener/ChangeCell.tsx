"use client";

import { cn } from "@/utils/cn";
import { formatChange } from "@/utils/format";

interface ChangeCellProps {
  value?: number | null;
  className?: string;
}

export function ChangeCell({ value, className }: ChangeCellProps) {
  if (value == null || isNaN(value)) {
    return <span className={cn("text-muted-foreground", className)}>—</span>;
  }
  return (
    <span
      className={cn(
        "font-thin text-xs tabular-nums",
        value >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-500 dark:text-red-400",
        className,
      )}
    >
      {formatChange(value)}
    </span>
  );
}
