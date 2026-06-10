import { BrowserRouter, useLocation, useNavigate } from "react-router";
import Home from "./pages/Home";
import TopBar from "./components/TopBar";
import Button from "./components/ui/Button";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Project from "./pages/Project";
import CrudDemo from "./pages/CrudDemo";
import Rewiew from "./pages/Review";
import Contact from "./pages/Contact";
import { useEffect, useRef } from "react";
import { cn } from "./utils/cn";

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

  const isProgrammaticScroll = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastNavigatedPath = useRef(location.pathname);

  const NAV_ITEMS = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/experience", label: "Esperienza" },
    { path: "/project", label: "Progetti" },
    { path: "/crud-demo", label: "CRUD Demo" },
    { path: "/rewiew", label: "Recensioni" },
    { path: "/contact", label: "Contatti" },
  ];

  const currentIndex = NAV_ITEMS.findIndex((item) => item.path === path);

  const validIndex = currentIndex === -1 ? 0 : currentIndex;

  const firstIndex = validIndex - 1 < 0 ? NAV_ITEMS.length - 1 : validIndex - 1;
  const lastIndex = validIndex + 1 > NAV_ITEMS.length - 1 ? 0 : validIndex + 1;

  const mobileNavItems = [
    NAV_ITEMS[firstIndex],
    NAV_ITEMS[validIndex],
    NAV_ITEMS[lastIndex],
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefaultScroll = (e: Event) => {
      if (isProgrammaticScroll.current) e.preventDefault();
    };

    const preventDefaultKeyboard = (e: KeyboardEvent) => {
      const keys = [
        "ArrowUp",
        "ArrowDown",
        " ",
        "PageUp",
        "PageDown",
        "Home",
        "End",
      ];
      if (isProgrammaticScroll.current && keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", preventDefaultScroll, {
      passive: false,
    });
    container.addEventListener("touchmove", preventDefaultScroll, {
      passive: false,
    });
    globalThis.addEventListener("keydown", preventDefaultKeyboard, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", preventDefaultScroll);
      container.removeEventListener("touchmove", preventDefaultScroll);
      globalThis.removeEventListener("keydown", preventDefaultKeyboard);
    };
  }, []);

  useEffect(() => {
    const targetElement = document.getElementById(path);
    if (targetElement) {
      isProgrammaticScroll.current = true;
      lastNavigatedPath.current = path;

      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

      const timer = globalThis.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 300);

      return () => globalThis.clearTimeout(timer);
    }
  }, [path]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("section");

    const observerOptions = {
      root: container,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isProgrammaticScroll.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          const detectedId = entry.target.id;

          if (lastNavigatedPath.current !== detectedId) {
            lastNavigatedPath.current = detectedId;
            navigate(detectedId, { replace: true });
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen overflow-x-hidden">
      <TopBar className="justify-center 2xl:justify-between">
        <h2 className="hidden 2xl:block text-nowrap">Fabrizio Lombardi</h2>
        <div className="lg:flex flex-row gap-4 hidden">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.label}
              variant={path === item.path ? "primary" : "transparent"}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 lg:hidden bg-muted-foreground/50 p-1 rounded-full w-80 mx-5 items-center justify-items-center">
          {mobileNavItems.map((item) => (
            <Button
              className={cn(
                "p-1 rounded-full w-full text-center text-nowrap",
                path === item?.path
                  ? "text-foreground"
                  : "text-foreground/30 text-sm",
              )}
              key={item?.label}
              variant={path === item?.path ? "primary" : "transparent"}
              onClick={() => item && navigate(item.path)}
            >
              {item?.label}
            </Button>
          ))}
        </div>
      </TopBar>

      <div
        ref={containerRef}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        <Home />
        <About />
        <Experience />
        <Project />
        <CrudDemo />
        <Rewiew />
        <Contact />
      </div>
    </div>
  );
}

export default App;
