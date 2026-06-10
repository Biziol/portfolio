import { useEffect } from "react";
import {
  CheckCircle2,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
  XCircleIcon,
} from "lucide-react";
import Button from "./Button";

interface Props {
  message?: string;
  type?: "success" | "warning" | "generic" | "error" | "loading";
  autoHideMs?: number;
  onClose?: () => void;
}

export interface AlertType {
  message: string;
  type: "success" | "warning" | "generic" | "error" | "loading";
}

export default function Alert({
  message,
  type,
  autoHideMs = 1000,
  onClose,
}: Readonly<Props>) {
  useEffect(() => {
    if (!message || !onClose) {
      return;
    }

    if (type !== "loading" && type !== "error") {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoHideMs);
      return () => clearTimeout(timer);
    }
  }, [message, type, autoHideMs, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-10 left-0 flex w-full items-center justify-center">
      <div className="bg-muted-foreground flex w-max flex-row items-center gap-4 rounded-full p-4">
        {(type == "success" && <CheckCircle2 className="text-green-300" />) ||
          (type == "warning" && (
            <TriangleAlertIcon className="text-orange-300" />
          )) ||
          (type == "generic" && <InfoIcon className="text-blue-300" />) ||
          (type == "error" && <XCircleIcon className="text-red-300" />) ||
          (type == "loading" && (
            <Loader2Icon className="h-5 w-5 animate-spin text-blue-300" />
          ))}
        {message}

        {type == "error" && (
          <Button variant="transparent" onClick={() => onClose?.()}>
            Ok
          </Button>
        )}
      </div>
    </div>
  );
}
