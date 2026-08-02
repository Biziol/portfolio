import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary" | "transparent";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  href?: string;
  newTab?: boolean;
  disabled?: boolean;
}

export default function Button({
  children,
  className,
  variant = "primary",
  onClick,
  type = "button",
  href,
  newTab = false,
  disabled = false,
}: Readonly<ButtonProps>) {
  const buttonClasses = cn(
    "py-2 px-3 w-max flex flex-row gap-2 items-center rounded-lg justify-center font-semibold cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
    variant === "primary" &&
      "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "secondary" &&
      "bg-transparent border border-border hover:bg-muted",
    variant === "tertiary" &&
      "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
    variant === "transparent" && "bg-transparent hover:bg-primary/10",

    className,
  );
  if (href) {
    return (
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={buttonClasses}
        aria-disabled={disabled}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
