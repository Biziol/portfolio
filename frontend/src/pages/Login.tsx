import { ExternalLinkIcon, LogInIcon, TriangleAlert } from "lucide-react";
import Form from "../components/Form";
import Scaffold from "../components/Scaffold";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useState } from "react";
import { login } from "../services/AuthService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function HandleLogin() {
    login(username, password)
      .then(() => {
        globalThis.location.href = "/crud-demo";
      })
      .catch();
  }

  return (
    <Scaffold className="justify-center" prevPath="/project" nextPath="/rewiew">
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
            href="/register"
            className="hover:bg-transparent"
          >
            Registrati
            <ExternalLinkIcon />
          </Button>
        </div>
      </Form>
    </Scaffold>
  );
}
