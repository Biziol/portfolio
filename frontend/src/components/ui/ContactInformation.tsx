import type { ReactNode } from "react";
import Button from "./Button";

interface ContactInformationProps {
  icon?: ReactNode;
  field?: string;
  value?: string;
  href?: string;
}

export default function ContactInformation({
  icon,
  field,
  value,
  href,
}: Readonly<ContactInformationProps>) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {icon && (
        <Button href={href ?? ""} newTab variant="tertiary" className="p-3">
          {icon}
        </Button>
      )}

      {field && value && (
        <div className="flex flex-col gap-1">
          <h4>{field}</h4>
          <p className="text-foreground/60">{value}</p>
        </div>
      )}
    </div>
  );
}
