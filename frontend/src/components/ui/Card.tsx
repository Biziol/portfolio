import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  onClick,
  ...props
}: Readonly<CardProps>) {
  const baseClassName = cn(
    'border-border bg-muted flex flex-col items-start gap-5 rounded-xl border p-5',
    className,
    onClick && 'cursor-pointer',
  );

  if (onClick) {
    return (
      <button
        {...props}
        type="button"
        className={baseClassName}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <div {...props} className={baseClassName}>
      {children}
    </div>
  );
}
