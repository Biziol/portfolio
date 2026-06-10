import { ExternalLinkIcon, TriangleAlert, UserPlusIcon } from "lucide-react";
import Form from "../components/Form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useState } from "react";
import { register } from "../services/AuthService";

export default function Registration({
  onRedirect,
}: Readonly<{ onRedirect: () => void }>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  async function HandleRegistration() {
    if (password == passwordCheck) {
      register(username, password)
        .then(() => onRedirect())
        .catch((e) => alert(e.message));
    } else alert("le password non sono identiche");
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
      </Form>
  );
}
