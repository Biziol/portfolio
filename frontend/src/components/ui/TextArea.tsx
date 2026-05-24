import { cn } from "../../utils/cn";

interface TextAreaProps {
  onChange?: (value: string) => void;
  required?: boolean;
  className?: string;
  label?: string;
  value?: string;
}

export default function TextArea({
  label,
  className,
  required,
  onChange,
  value,
  ...props
}: Readonly<TextAreaProps>) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label className="flex gap-1">
          {label} {required && <p className="text-red-500">*</p>}
        </label>
      )}
      <textarea
        {...props}
        required={required}
        value={value}
        className={cn("bg-muted-foreground w-full rounded-xl p-2", className)}
        onChange={(e) => onChange?.(e.target.value)}
      ></textarea>
    </div>
  );
}
