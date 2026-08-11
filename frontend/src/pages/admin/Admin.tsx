import { useState } from "react";
import Scaffold from "../../components/Scaffold";
import TopBar from "../../components/TopBar";
import Button from "../../components/ui/Button";
import { LogOutIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import Hero from "./components/About";
import { UseAuth } from "../../context/AuthContext";
import Login from "./components/Login";
import Alert, { type AlertType } from "../../components/ui/Alert";
import { logout } from "../../services/AuthService";
import Experience from "./components/Experience";

export default function Admin() {
  const sections = ["About", "Esperienza"];
  const [selectedSection, setSelectedSection] = useState<string>("About");
  const { isAuthenticated, loading, clearUser, user } = UseAuth();
  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);
  const handleCloseAlert = () => setAlertMessage(null);

  const handleLogout = () => {
    setAlertMessage({ type: "loading", message: "Logout in corso..." });
    logout()
      .then(() => {
        clearUser();
        setAlertMessage({ type: "success", message: "Logout eseguito!" });
      })
      .catch((e) => {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setAlertMessage({ type: "error", message: errorMessage });
      });
  };

  if (loading) {
    return (
      <Scaffold className="justify-center items-center">
        <Alert type="loading" message="Verifica sessione in corso..." />
      </Scaffold>
    );
  }

  if (isAuthenticated && user?.role == "ADMIN") {
    return (
      <Scaffold>
        <TopBar>
          <h1>Admin area</h1>

          <div className="p-2 gap-2 flex flex-row rounded-full bg-muted-foreground/50">
            {sections.map((s) => (
              <Button
                key={s}
                variant={s != selectedSection ? "transparent" : "tertiary"}
                className={cn(
                  "rounded-full",
                  s == selectedSection &&
                    "hover:bg-primary/10 hover:text-primary",
                )}
                onClick={() => setSelectedSection(s)}
              >
                {s}
              </Button>
            ))}
          </div>

          <Button variant="transparent" onClick={handleLogout}>
            <LogOutIcon className="text-primary" />
          </Button>
        </TopBar>

        {sections[0] == selectedSection && <Hero />}
        {sections[1] == selectedSection && <Experience />}
        {alertMessage && (
          <Alert
            type={alertMessage.type}
            message={alertMessage.message}
            onClose={handleCloseAlert}
          />
        )}
      </Scaffold>
    );
  } else {
    return (
      <Scaffold className="justify-center">
        <Login />
      </Scaffold>
    );
  }
}
