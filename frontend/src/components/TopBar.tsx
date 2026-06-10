import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface TopBarProps {
  children?: ReactNode;
  className?: string;
}

export default function TopBar({ children, className }: Readonly<TopBarProps>) {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-10 backdrop-blur-md w-full flex flex-row justify-between sm:px-5 lg:px-50 py-5 items-center border-b border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
