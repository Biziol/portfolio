import { LockIcon, LogInIcon, UserPlus2Icon } from "lucide-react";
import Form from "../../../components/Form";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import { adminExist, login, register } from "../../../services/AuthService";
import { UseAuth } from "../../../context/AuthContext";
import type { AlertType } from "../../../components/ui/Alert";
import Alert from "../../../components/ui/Alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);
  const handleCloseAlert = () => setAlertMessage(null);
  const [isAdminExist, setIsAdminExist] = useState<boolean>(true);
  const { refreshUser } = UseAuth();

  useEffect(() => {
    adminExist().then((result) => {
      setIsAdminExist(result);
      console.log("adminExist: " + result);
    });
  });

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

  async function HandleRegistration() {
    if (password == passwordCheck) {
      setAlertMessage({ type: "loading", message: "Registrazione..." });
      register(username, password, "ADMIN")
        .then(() => {
          setAlertMessage({
            type: "success",
            message: `Benvenuto ${username}!`,
          });
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

  if (isAdminExist) {
    return (
      <Form onSubmit={HandleLogin} className="max-w-130 items-center w-full">
        <div className="p-3 bg-primary/20 rounded-2xl">
          <LockIcon className="text-primary w-8 h-8" />
        </div>
        <h2>Admin Login</h2>
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

        <Button type="submit" className="w-full">
          <LogInIcon />
          Login
        </Button>

        {alertMessage && (
          <Alert
            type={alertMessage.type}
            message={alertMessage.message}
            onClose={handleCloseAlert}
          />
        )}
      </Form>
    );
  } else
    return (
      <Form
        onSubmit={HandleRegistration}
        className="max-w-130 items-center w-full"
      >
        <div className="p-3 bg-primary/20 rounded-2xl">
          <LockIcon className="text-primary w-8 h-8" />
        </div>
        <h2>Admin Registration</h2>
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
          label="Password Check"
          required
          type="password"
          value={passwordCheck}
          onChange={(v) => setPasswordCheck(v)}
        />

        <Button type="submit" className="w-full">
          <UserPlus2Icon />
          Register
        </Button>

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
