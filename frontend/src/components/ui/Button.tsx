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
    "py-2 px-3 w-max flex flex-row gap-2 items-center rounded-lg justify-center font-semibold hover:cursor-pointer",
    variant == "primary" && "bg-primary text-primary-foreground",
    variant == "secondary" && "bg-transparent border border-border",
    variant == "tertiary" &&
      "bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors",
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
