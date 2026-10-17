import { useLayoutEffect, type RefObject } from "react";

// Only offscreen elements are hidden, before they enter the viewport. Visible
// content and late API responses never jump back to opacity zero.
export function useSectionReveal(rootRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<HTMLElement>();
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;

    const reveal = (element: HTMLElement) => {
      seen.add(element);
      element.dataset.reveal = "visible";
      observer?.unobserve(element);
    };
    const stop = () => {
      observer?.disconnect();
      mutations?.disconnect();
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        delete element.dataset.reveal;
      });
    };
    const start = () => {
      stop();
      if (preference.matches) return;
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }
      }, { root, rootMargin: "0px 0px 64px 0px", threshold: 0 });

      const scan = () => {
        const bottom = root.getBoundingClientRect().bottom;
        root.querySelectorAll<HTMLElement>(
          ':scope > section[id]:not([id="/"]) > *, :scope > section[id]:not([id="/"]) [data-motion-card]',
        ).forEach((element) => {
          if (!(element instanceof HTMLElement) || seen.has(element) || element.dataset.reveal) return;
          if (element.querySelector("[data-motion-card]") || getComputedStyle(element).position === "fixed") return;
          // A single long workflow card remains stationary while reading it.
          if (element.getBoundingClientRect().height > root.clientHeight) { seen.add(element); return; }
          if (element.getBoundingClientRect().top < bottom + 24 || element.contains(document.activeElement)) {
            seen.add(element);
            return;
          }
          element.dataset.reveal = "pending";
          observer?.observe(element);
        });
      };
      scan();
      mutations = new MutationObserver(scan);
      mutations.observe(root, { childList: true, subtree: true });
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      let element = event.target.closest<HTMLElement>('[data-reveal="pending"]');
      while (element) {
        reveal(element);
        element = element.parentElement?.closest<HTMLElement>('[data-reveal="pending"]') ?? null;
      }
    };
    start();
    preference.addEventListener("change", start);
    root.addEventListener("focusin", onFocus);
    return () => {
      stop();
      preference.removeEventListener("change", start);
      root.removeEventListener("focusin", onFocus);
    };
  }, [rootRef]);
}
