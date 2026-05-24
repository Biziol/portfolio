import type { ReactNode, SubmitEvent } from "react";
import { cn } from "../utils/cn";

interface FormProps {
  children?: ReactNode;
  className?: string;
  onSubmit?: (e?: SubmitEvent<HTMLFormElement>) => void;
}

export default function Form({ children, className, onSubmit }: Readonly<FormProps>) {
  function handleSubmit(e?: SubmitEvent<HTMLFormElement>) {
    e?.preventDefault();
    onSubmit?.(e);
  }

  const baseClass =
    "border-border bg-muted flex flex-col items-start gap-5 rounded-xl border p-5";

  return (
    <form className={cn(baseClass, className)} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
