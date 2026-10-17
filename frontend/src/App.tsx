import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigationType,
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
import { memo, useRef } from "react";
import MobileSectionDial from "./components/MobileSectionDial";
import Admin from "./pages/admin/Admin";
import AiWorkflows from "./pages/AiWorkflows";
import { useSectionNavigation } from "./hooks/useSectionNavigation";
import { useSectionReveal } from "./hooks/useSectionReveal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-page" element={<Admin />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const navigationType = useNavigationType();

  const containerRef = useRef<HTMLDivElement>(null);
  const { activeSection, navigateToSection, isNavigating } = useSectionNavigation(containerRef, path, navigate,
    navigationType !== "POP" && location.state?.portfolioScroll === true, location.key);
  useSectionReveal(containerRef);

  const NAV_ITEMS = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/experience", label: "Esperienza" },
    { path: "/project", label: "Progetti" },
    { path: "/ai-workflow", label: "Workflow IA" },
    { path: "/crud-demo", label: "CRUD Demo" },
    { path: "/rewiew", label: "Recensioni" },
    { path: "/contact", label: "Contatti" },
  ];

  return (
    <div className="public-site flex flex-col h-screen overflow-x-hidden">
      {path !== "/admin" && path !== "/admin-page" && (
        <TopBar className="site-header justify-center 2xl:justify-between lg:px-5 xl:px-10 2xl:px-16">
          <h2 className="hidden 2xl:block text-nowrap">Fabrizio Lombardi</h2>
          <div className="xl:flex flex-row gap-4 hidden">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                variant={activeSection === item.path ? "primary" : "transparent"}
                onClick={() => navigateToSection(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <MobileSectionDial items={NAV_ITEMS} activePath={activeSection} onNavigate={navigateToSection} isNavigating={isNavigating} />
        </TopBar>
      )}

      <div
        ref={containerRef}
        className="min-h-0 flex-1 w-full overflow-y-auto overflow-x-hidden"
      >
        <PortfolioSections />
      </div>

    </div>
  );
}

// Route updates only refresh navigation, not Markdown, forms and every card.
const PortfolioSections = memo(function PortfolioSections() {
  return <>
    <Home />
    <About />
    <Experience />
    <Project />
    <AiWorkflows />
    <CrudDemo />
    <Rewiew />
    <Contact />
  </>;
});

export default App;
