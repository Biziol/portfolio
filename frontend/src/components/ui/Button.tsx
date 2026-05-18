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
        "py-1 px-1.5 w-max flex flex-row gap-1 items-center rounded-lg",
        variant == "primary" && "bg-primary text-primary-foreground",
        variant == "secondary" && "bg-transparent border border-gray-200",
        variant == "transparent" && "bg-transparent",
        classname,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
