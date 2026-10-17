import { useEffect, useId, useLayoutEffect, useRef, type PointerEvent } from "react";

interface SectionItem { path: string; label: string }
interface Props {
  items: readonly SectionItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  isNavigating: boolean;
}

const OFFSETS = [-2, -1, 0, 1, 2];
const DURATION = 220;

export default function MobileSectionDial({ items, activePath, onNavigate, isNavigating }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number; offset: number; dragging: boolean } | null>(null);
  const busy = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const pending = useRef<(() => void) | null>(null);
  const ignoreClickUntil = useRef(0);
  const focusCurrent = useRef(false);
  const hintId = useId();
  const activeIndex = Math.max(0, items.findIndex((item) => item.path === activePath));
  const itemAt = (offset: number) => items[(activeIndex + offset + items.length) % items.length];

  function draw(offset: number, animated = false) {
    const element = track.current;
    if (!element) return;
    const slot = (viewport.current?.clientWidth ?? 0) / 3;
    const duration = animated && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? DURATION : 0;
    element.style.transition = duration ? `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none";
    element.style.transform = `translate3d(calc(-20% + ${offset}px), 0, 0)`;
    element.querySelectorAll<HTMLButtonElement>("button").forEach((button, index) => {
      button.style.transition = duration ? `opacity ${duration}ms ease-out` : "none";
      button.style.opacity = String(1 - Math.min(1, Math.abs(index - 2 + (slot ? offset / slot : 0))) * 0.58);
    });
  }

  useLayoutEffect(() => {
    window.clearTimeout(timer.current);
    pending.current = null;
    busy.current = false;
    gesture.current = null;
    draw(0);
    if (focusCurrent.current) {
      track.current?.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus({ preventScroll: true });
      focusCurrent.current = false;
    }
  }, [activePath]);

  useEffect(() => {
    // Navigation may be interrupted before the visible section changes.
    if (!isNavigating && busy.current && !pending.current) {
      busy.current = false;
      focusCurrent.current = false;
      draw(0, true);
    }
  }, [isNavigating]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreference = () => { if (preference.matches) pending.current?.(); };
    preference.addEventListener("change", onPreference);
    return () => {
      window.clearTimeout(timer.current);
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  function choose(direction: number, keyboard = false) {
    if (busy.current || items.length < 2) return;
    if (!direction) { onNavigate(activePath); return; }
    busy.current = true;
    focusCurrent.current = keyboard;
    const next = itemAt(direction);
    const commit = () => {
      window.clearTimeout(timer.current);
      pending.current = null;
      onNavigate(next.path);
    };
    pending.current = commit;
    draw(-direction * (viewport.current?.clientWidth ?? 0) / 3, true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) commit();
    else timer.current = window.setTimeout(commit, DURATION + 20);
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (busy.current || !event.isPrimary || event.button !== 0) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, offset: 0, dragging: false };
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!current.dragging) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { gesture.current = null; return; }
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      current.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const slot = (viewport.current?.clientWidth ?? 0) / 3;
    current.offset = Math.max(-slot, Math.min(slot, dx));
    draw(current.offset);
  }

  function endGesture(event: PointerEvent<HTMLElement>, cancelled = false) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!current.dragging) return;
    ignoreClickUntil.current = event.timeStamp + 350;
    const threshold = (viewport.current?.clientWidth ?? 0) / 3 * 0.25;
    if (!cancelled && Math.abs(current.offset) >= threshold) choose(current.offset < 0 ? 1 : -1);
    else draw(0, true);
  }

  if (!items.length) return null;

  return (
    <nav className="mobile-dial xl:hidden" aria-label="Sezioni del portfolio" aria-describedby={hintId}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={(event) => endGesture(event)} onPointerCancel={(event) => endGesture(event, true)}
      onLostPointerCapture={(event) => {
        // Touch starts with implicit capture on a button. Ignore its loss when
        // capture moves to the dial itself for horizontal dragging.
        if (event.target === event.currentTarget) endGesture(event, true);
      }}
      onClickCapture={(event) => {
        if (event.timeStamp < ignoreClickUntil.current) { event.preventDefault(); event.stopPropagation(); }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          choose(event.key === "ArrowRight" ? 1 : -1, true);
        }
      }}>
      <span id={hintId} className="sr-only">Trascina a sinistra per la sezione successiva, a destra per la precedente. Puoi anche usare i pulsanti o i tasti freccia.</span>
      <div ref={viewport} className="mobile-dial-window">
        <span className="mobile-dial-selection" aria-hidden="true" />
        <div ref={track} className="mobile-dial-track">
          {OFFSETS.map((offset) => {
            const item = itemAt(offset);
            const hidden = Math.abs(offset) > 1;
            return (
              <button key={offset} type="button" tabIndex={hidden ? -1 : 0} aria-hidden={hidden || undefined}
                aria-current={offset === 0 ? "page" : undefined}
                onClick={(event) => choose(offset, event.detail === 0)}>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
