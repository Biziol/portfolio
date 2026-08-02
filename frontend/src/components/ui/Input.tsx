import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "../../utils/cn";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  onChange?: (value: string) => void;
  type?:
    | "number"
    | "date"
    | "text"
    | "email"
    | "password"
    | "file"
    | "username";
  label?: string;
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
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label className="flex gap-1 text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <input
          {...props}
          type={inputType}
          required={required}
          value={value}
          className={cn(
            "bg-muted-foreground w-full rounded-xl p-2",
            isPasswordType && "pr-10",
            className,
          )}
          onChange={(e) => onChange?.(e.target.value)}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Nascondi password" : "Mostra password"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
