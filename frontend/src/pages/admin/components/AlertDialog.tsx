import { AlertTriangleIcon, CheckCircle2Icon, XIcon } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

interface AlertDialogProps {
  message: string;
  onAccept: () => void;
  onClose: () => void;
}

export default function AlertDialog({
  message,
  onAccept,
  onClose,
}: Readonly<AlertDialogProps>) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-md backdrop-brightness-80 px-5">
      <Card>
        <div className="flex flex-row gap-2">
          <AlertTriangleIcon />
          <h2>Attenzione!</h2>
        </div>

        {message}

        <div className="flex flex-row justify-between w-full">
          <Button onClick={onClose}>
            <XIcon />
            Chiudi
          </Button>
          <Button onClick={onAccept}>
            <CheckCircle2Icon />
            Ok
          </Button>
        </div>
      </Card>
    </div>
  );
}
