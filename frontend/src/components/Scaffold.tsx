import type { ReactNode } from "react";

interface ScaffoldProps {
  children?: ReactNode;
}

export default function Scaffold({ children }: Readonly<ScaffoldProps>) {
  return <div className="w-full px-50 h-dvh flex flex-col gap-5 items-center justify-center">{children}</div>;
}
