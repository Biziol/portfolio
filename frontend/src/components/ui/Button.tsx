import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps {
  children?: ReactNode;
  classname?: string;
  variant?: "primary" | "secondary" | "transparent";
  onClick?: () => void;
}

export default function Button({
  children,
  classname,
  variant = "primary",
  onClick,
}: Readonly<ButtonProps>) {
  return (
    <button
      className={cn(
        "py-2 px-3 w-max flex flex-row gap-1 items-center rounded-lg",
        variant == "primary" && "bg-primary text-primary-foreground",
        variant == "secondary" && "bg-transparent border border-border",
        variant == "transparent" && "bg-transparent hover:bg-primary/10",
        classname,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
