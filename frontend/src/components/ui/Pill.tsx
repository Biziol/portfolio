import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface PillProps {
  color?: string | null;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function Pill({
  children,
  color,
  className,
  style,
}: Readonly<PillProps>) {
  return (
    <span
      className={cn(
        "flex gap-1 items-center px-2 py-0 text-xs font-semibold border-border bg-muted-foreground border rounded-lg",
        className,
      )}
      style={style ?? (color ? { backgroundColor: color } : undefined)}
    >
      {children}
    </span>
  );
}
