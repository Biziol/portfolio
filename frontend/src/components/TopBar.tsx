import type { ReactNode } from "react";

interface TopBarProps {
  children?: ReactNode;
}

export default function TopBar({ children }: Readonly<TopBarProps>) {
  return (
    <div className=" sticky top-0 left-0 w-full flex flex-row justify-between px-50 py-5 items-center border-b border-border">
      {children}
    </div>
  );
}
