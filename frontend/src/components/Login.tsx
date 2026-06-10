import { ExternalLinkIcon, LogInIcon, TriangleAlert } from "lucide-react";
import Form from "./Form";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useState } from "react";
import { login } from "../services/AuthService";
import { UseAuth } from "../context/AuthContext";
import type { AlertType } from "./ui/Alert";
import Alert from "./ui/Alert";

export default function Login({
  onRedirect,
}: Readonly<{ onRedirect: () => void }>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);
  const handleCloseAlert = () => setAlertMessage(null);
  const { refreshUser } = UseAuth();

  async function HandleLogin() {
    setAlertMessage({ type: "loading", message: "Accesso..." });
    login(username, password)
      .then(() => {
        setAlertMessage({ type: "success", message: "Accesso eseguito!" });
        refreshUser();
      })
      .catch((e) => {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setAlertMessage({ type: "error", message: errorMessage });
      });
  }

  return (
    <Form onSubmit={HandleLogin} className="max-w-130">
      <h2>Login</h2>
      <div className="border border-amber-500 rounded-xl bg-amber-500/10 text-amber-500 p-2 flex flex-col gap-2">
        <h3 className="flex flex-row gap-1">
          <TriangleAlert />
          Attenzione
        </h3>
        <p>
          Si ricorda che questa è una demo, <br />
          pertanto si consiglia di non inserire dati sensibili grazie!
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

      <div className="flex flex-row w-full justify-between">
        <Button type="submit">
          <LogInIcon />
          Login
        </Button>
        <Button
          variant="transparent"
          onClick={onRedirect}
          className="hover:bg-transparent"
        >
          Registrati
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
