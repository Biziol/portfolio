import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface ScaffoldProps {
  children?: ReactNode;
  className?: string;
}

export default function Scaffold({
  children,
  className,
}: Readonly<ScaffoldProps>) {
  return (
    <div
      className={cn(
        "w-full py-10 px-50 flex flex-1 flex-col gap-10 items-center overflow-y-auto box-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
