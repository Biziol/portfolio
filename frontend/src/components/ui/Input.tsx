import { cn } from "../../utils/cn";

interface InputProps {
  onChange?: (value: string) => void;
  type?: "number" | "date" | "text" | "email" | "username" | "password";
  required?: boolean;
  className?: string;
  label?: string;
  value?: string;
}

export default function Input({
  type = "text",
  required = false,
  className,
  onChange,
  label,
  value,
  ...props
}: Readonly<InputProps>) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label className="flex gap-1">
          {label} {required && <p className="text-red-500">*</p>}
        </label>
      )}
      <input
        {...props}
        type={type}
        required={required}
        value={value}
        className={cn("bg-muted-foreground w-full rounded-xl p-2", className)}
        onChange={(e) => onChange?.(e.target.value)}
      ></input>
    </div>
  );
}
