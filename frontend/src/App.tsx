import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import Home from "./pages/Home";
import TopBar from "./components/TopBar";
import Button from "./components/ui/Button";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Project from "./pages/Project";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  return (
    <div className="flex flex-col h-full">
      <TopBar>
        <h2>Fabrizio Lombardi</h2>

        <div className="flex flex-row gap-4">
          <Button
            variant={path === "/" ? "primary" : "transparent"}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            variant={path === "/about" ? "primary" : "transparent"}
            onClick={() => navigate("/about")}
          >
            About
          </Button>
          <Button
            variant={path === "/experience" ? "primary" : "transparent"}
            onClick={() => navigate("/experience")}
          >
            Esperienza
          </Button>
          <Button
            variant={path === "/project" ? "primary" : "transparent"}
            onClick={() => navigate("/project")}
          >
            Progetti
          </Button>
          <Button
            variant={path === "/crud-demo" ? "primary" : "transparent"}
            onClick={() => navigate("/crud-demo")}
          >
            CRUD Demo
          </Button>
          <Button
            variant={path === "/recensioni" ? "primary" : "transparent"}
            onClick={() => navigate("/recensioni")}
          >
            Recensioni
          </Button>
          <Button
            variant={path === "/contatti" ? "primary" : "transparent"}
            onClick={() => navigate("/contatti")}
          >
            Contatti
          </Button>
        </div>
      </TopBar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </div>
  );
}

export default App;
