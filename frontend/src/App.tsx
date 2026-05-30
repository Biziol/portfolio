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
import CrudDemo from "./pages/CrudDemo";
import Rewiew from "./pages/Review";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import { UseAuth } from "./context/AuthContext";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

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
  const { user, loading, isAuthenticated } = UseAuth();

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
            variant={
              path === "/crud-demo" || path === "/login" || path === "/register"
                ? "primary"
                : "transparent"
            }
            onClick={() => navigate("/crud-demo")}
          >
            CRUD Demo
          </Button>
          <Button
            variant={path === "/rewiew" ? "primary" : "transparent"}
            onClick={() => navigate("/rewiew")}
          >
            Recensioni
          </Button>
          <Button
            variant={path === "/contact" ? "primary" : "transparent"}
            onClick={() => navigate("/contact")}
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
        <Route
          element={
            <ProtectedRoute
              isLoading={loading}
              isAuthenticated={isAuthenticated}
            />
          }
        >
          <Route path="/crud-demo" element={<CrudDemo />} />
          <Route
            element={
              <RoleProtectedRoute userRole={user?.role} requiredRole="ADMIN" />
            }
          >
            <Route path="/admin-page" element />
          </Route>
        </Route>
        <Route path="/rewiew" element={<Rewiew />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;
