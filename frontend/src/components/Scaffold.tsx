import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface ScaffoldProps {
  children?: ReactNode;
  className?: string;
  id?: string;
}

export default function Scaffold({
  children,
  className,
  id,
}: Readonly<ScaffoldProps>) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full min-h-dvh pt-30 pb-10 lg:px-50 md:px-30 px-5 flex flex-col gap-10 items-center box-border overflow-none",
        className,
      )}
    >
      {children}
    </section>
  );
}
