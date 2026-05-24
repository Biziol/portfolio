import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import Button from "./Button";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

interface SelectProps {
  children?: ReactNode;
  placeHolder?: string;
  value?: string;
  label?: string;
  required?: boolean;
  onChange: (v: string) => void;
}

export function Select({
  children,
  placeHolder = "Seleziona un opzione",
  value,
  label,
  required = false,
  onChange,
}: Readonly<SelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const selectItems = Children.toArray(children).filter((child) => {
    return isValidElement<SelectItemProps>(child) && child.type === SelectItem;
  }) as Array<ReactElement<SelectItemProps, typeof SelectItem>>;

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="flex gap-1">
          {label} {required && <p className="text-red-500">*</p>}
        </label>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        variant="transparent"
        className="w-full bg-muted-foreground justify-between"
      >
        {selectedValue || placeHolder}
        <ChevronDown rotate={isOpen ? 90 : 0} />
      </Button>

      {isOpen && (
        <div className="relative w-full flex flex-col bg-muted-foreground rounded-lg">
          {selectItems.map((item) =>
            cloneElement(item, {
              onClick: (v: string) => {
                setSelectedValue(v);
                setIsOpen(false);
                onChange(v);
              },
              selectedValue: value,
            }),
          )}
        </div>
      )}
    </div>
  );
}

interface SelectItemProps {
  children?: ReactNode;
  value: string;
  onClick?: (value: string) => void;
  selectedValue?: string;
}
export function SelectItem({
  children,
  value,
  onClick,
  selectedValue,
}: Readonly<SelectItemProps>) {
  return (
    <Button
      onClick={() => onClick?.(value)}
      type="button"
      variant="transparent"
      className={cn(
        "w-full",
        selectedValue == value ? "bg-primary/20" : "bg-transparent",
      )}
    >
      {children ?? value}
    </Button>
  );
}
