import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "transparent";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  href?: string;
  newTab?: boolean;
}

export default function Button({
  children,
  className,
  variant = "primary",
  onClick,
  type = "button",
  href,
  newTab = false,
}: Readonly<ButtonProps>) {
  const buttonClasses = cn(
    "py-2 px-3 w-max flex flex-row gap-1 items-center rounded-lg",
    variant == "primary" && "bg-primary text-primary-foreground",
    variant == "secondary" && "bg-transparent border border-border",
    variant == "transparent" && "bg-transparent hover:bg-primary/10",
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={buttonClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
}
