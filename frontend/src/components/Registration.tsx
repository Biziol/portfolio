import { ExternalLinkIcon, TriangleAlert, UserPlusIcon } from "lucide-react";
import Form from "./Form";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useState } from "react";
import { register } from "../services/AuthService";
import type { AlertType } from "./ui/Alert";
import Alert from "./ui/Alert";

export default function Registration({
  onRedirect,
}: Readonly<{ onRedirect: () => void }>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);
  const handleCloseAlert = () => setAlertMessage(null);

  async function HandleRegistration() {
    if (password == passwordCheck) {
      setAlertMessage({ type: "loading", message: "Registrazione..." });
      register(username, password)
        .then(() => {
          setAlertMessage({
            type: "success",
            message: `Benvenuto ${username}!`,
          });
          onRedirect();
        })
        .catch((e) => {
          const errorMessage = e instanceof Error ? e.message : String(e);
          setAlertMessage({ type: "error", message: errorMessage });
        });
    } else
      setAlertMessage({
        type: "warning",
        message: "Le password non coincidono!",
      });
  }

  return (
    <Form onSubmit={HandleRegistration} className="max-w-130">
      <h2>Registrati</h2>
      <div className="border border-amber-500 rounded-xl bg-amber-500/10 text-amber-500 p-2 flex flex-col gap-2">
        <h3 className="flex flex-row gap-1">
          <TriangleAlert />
          Attenzione
        </h3>
        <p>
          Si ricorda che questa è una demo, pertanto si consiglia di non
          inserire dati sensibili grazie!
        </p>
      </div>
      <Input
        label="Username"
        required
        type="username"
        value={username}
        onChange={(v) => setUsername(v)}
      />
      <Input
        label="Password"
        required
        type="password"
        value={password}
        onChange={(v) => setPassword(v)}
      />

      <Input
        label="Password"
        required
        type="password"
        value={passwordCheck}
        onChange={(v) => setPasswordCheck(v)}
      />

      <div className="flex flex-row w-full justify-between">
        <Button type="submit">
          <UserPlusIcon />
          Registrati
        </Button>
        <Button
          variant="transparent"
          onClick={onRedirect}
          className="hover:bg-transparent"
        >
          login
          <ExternalLinkIcon />
        </Button>
      </div>
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          message={alertMessage.message}
          onClose={handleCloseAlert}
        />
      )}
    </Form>
  );
}
