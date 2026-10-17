import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { NavigateFunction } from "react-router";

type HistoryMode = "push" | "replace" | "none";
interface ScrollController {
  goTo: (path: string, history: HistoryMode, instant?: boolean) => void;
}

export function useSectionNavigation(
  rootRef: RefObject<HTMLDivElement | null>, path: string, navigate: NavigateFunction,
  fromScroll: boolean, locationKey: string,
) {
  const [activeSection, setActiveSection] = useState(path);
  const [isNavigating, setIsNavigating] = useState(false);
  const visiblePath = useRef(path);
  const routePath = useRef(path);
  const navigateRef = useRef(navigate);
  const controller = useRef<ScrollController | null>(null);
  const firstVisit = useRef(true);

  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > section[id]"));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame: number | null = null;
    let selectionFrame: number | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let userScrolling = false;
    let interruptedNavigation = false;
    let settledSection = routePath.current;
    let completeAnimation: (() => void) | null = null;

    const syncSelection = () => {
      const marker = root.getBoundingClientRect().top + root.clientHeight * 0.5;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section;
        else break;
      }
      if (current && current.id !== visiblePath.current) {
        visiblePath.current = current.id;
        setActiveSection(current.id);
      }
      return current;
    };
    const scheduleSelection = () => {
      if (selectionFrame !== null) return;
      selectionFrame = requestAnimationFrame(() => {
        selectionFrame = null;
        syncSelection();
      });
    };
    const commitPath = (section: HTMLElement, history: HistoryMode) => {
      settledSection = section.id;
      if (history === "none" || routePath.current === section.id) return;
      routePath.current = section.id;
      // This route update records the finished movement; it never starts one.
      void navigateRef.current(section.id, {
        replace: history === "replace", state: { portfolioScroll: true },
      });
    };
    const cancelAnimation = () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      completeAnimation = null;
    };
    const goTo = (targetPath: string, history: HistoryMode, instant = false) => {
      const target = sections.find((section) => section.id === targetPath);
      if (!target) return;
      cancelAnimation();
      clearTimeout(idleTimer);
      userScrolling = false;
      interruptedNavigation = false;
      const start = root.scrollTop;
      const top = Math.max(0, Math.min(
        start + target.getBoundingClientRect().top - root.getBoundingClientRect().top,
        root.scrollHeight - root.clientHeight,
      ));
      const distance = top - start;
      const complete = () => {
        animationFrame = null;
        completeAnimation = null;
        setIsNavigating(false);
        clearTimeout(idleTimer);
        root.scrollTo({ top, behavior: "instant" });
        const current = syncSelection();
        if (current) commitPath(current, history);
      };
      if (instant || preference.matches || Math.abs(distance) < 1) {
        complete();
        return;
      }
      completeAnimation = complete;
      setIsNavigating(true);
      const duration = Math.min(1250, 460 + Math.sqrt(Math.abs(distance)) * 12);
      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
        root.scrollTo({ top: start + distance * eased, behavior: "instant" });
        if (progress < 1) animationFrame = requestAnimationFrame(step);
        else complete();
      };
      animationFrame = requestAnimationFrame(step);
    };
    const settle = () => {
      if (animationFrame !== null) return;
      clearTimeout(idleTimer);
      const current = syncSelection();
      const allowAlignment = userScrolling && !interruptedNavigation;
      userScrolling = false;
      interruptedNavigation = false;
      if (!current) return;
      const nearBoundary = Math.abs(current.getBoundingClientRect().top - root.getBoundingClientRect().top) <= root.clientHeight * 0.85;
      const editing = document.activeElement?.matches("input, textarea, select, [contenteditable='true']");
      if (allowAlignment && current.id !== settledSection && nearBoundary && !editing && !preference.matches) {
        // Alignment operates on sections directly, independently of the router.
        goTo(current.id, "replace");
      } else commitPath(current, "replace");
    };
    const onScroll = () => {
      scheduleSelection();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(settle, 50);
    };
    const interrupt = () => {
      userScrolling = true;
      if (animationFrame !== null) {
        interruptedNavigation = true;
        cancelAnimation();
        setIsNavigating(false);
      }
      onScroll();
    };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) interrupt();
    };
    const onPreference = () => {
      if (preference.matches && completeAnimation) {
        if (animationFrame !== null) cancelAnimationFrame(animationFrame);
        completeAnimation();
      }
    };

    controller.current = { goTo };
    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("scrollend", onScroll);
    root.addEventListener("wheel", interrupt, { passive: true });
    root.addEventListener("touchstart", interrupt, { passive: true });
    root.addEventListener("pointerdown", interrupt, { passive: true });
    root.addEventListener("keydown", onKey);
    window.addEventListener("resize", onScroll);
    preference.addEventListener("change", onPreference);
    return () => {
      cancelAnimation();
      if (selectionFrame !== null) cancelAnimationFrame(selectionFrame);
      clearTimeout(idleTimer);
      controller.current = null;
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("scrollend", onScroll);
      root.removeEventListener("wheel", interrupt);
      root.removeEventListener("touchstart", interrupt);
      root.removeEventListener("pointerdown", interrupt);
      root.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onScroll);
      preference.removeEventListener("change", onPreference);
    };
  }, [rootRef]);

  useEffect(() => {
    routePath.current = path;
    if (fromScroll) return;
    controller.current?.goTo(path, "none", firstVisit.current);
    firstVisit.current = false;
  }, [path, rootRef, fromScroll, locationKey]);

  const navigateToSection = useCallback((target: string) => {
    controller.current?.goTo(target, "push");
  }, []);

  return { activeSection, navigateToSection, isNavigating };
}
