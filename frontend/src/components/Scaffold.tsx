import type { ReactNode, WheelEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "../utils/cn";

interface ScaffoldProps {
  children?: ReactNode;
  className?: string;
  prevPath?: string;
  nextPath?: string;
}

type BoundaryDirection = 1 | -1 | 0;

export default function Scaffold({
  children,
  className,
  prevPath,
  nextPath,
}: Readonly<ScaffoldProps>) {
  const navigate = useNavigate();
  const wheelLockRef = useRef(false);
  const resistanceRef = useRef(0);
  const directionRef = useRef<BoundaryDirection>(0);
  const unlockTimerRef = useRef<number | null>(null);
  const [indicatorDirection, setIndicatorDirection] =
    useState<BoundaryDirection>(0);
  const [resistance, setResistance] = useState(0);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current !== null) {
        globalThis.clearTimeout(unlockTimerRef.current);
      }
    };
  }, []);

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (wheelLockRef.current) {
      return;
    }

    const container = event.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const scrollingDown = event.deltaY > 0;
    const scrollingUp = event.deltaY < 0;
    let direction: 1 | -1 | 0 = 0;

    if (scrollingDown) {
      direction = 1;
    } else if (scrollingUp) {
      direction = -1;
    }
    const hasBoundary =
      (atBottom && scrollingDown && nextPath) ||
      (atTop && scrollingUp && prevPath);

    if (!hasBoundary) {
      resistanceRef.current = 0;
      directionRef.current = 0;
      setResistance(0);
      setIndicatorDirection(0);
      return;
    }

    if (directionRef.current !== direction) {
      directionRef.current = direction;
      resistanceRef.current = 0;
      setResistance(0);
    }

    resistanceRef.current += Math.abs(event.deltaY);
    setIndicatorDirection(direction);
    setResistance(resistanceRef.current);

    event.preventDefault();

    const resistanceThreshold = 180;

    if (resistanceRef.current >= resistanceThreshold) {
      resistanceRef.current = 0;
      setResistance(0);
      setIndicatorDirection(0);
      wheelLockRef.current = true;

      if (scrollingDown && nextPath) {
        navigate(nextPath);
      } else if (scrollingUp && prevPath) {
        navigate(prevPath);
      }

      unlockTimerRef.current = globalThis.setTimeout(() => {
        wheelLockRef.current = false;
      }, 350);
    }
  }

  return (
    <div
      className={cn(
        "relative w-full h-full py-10 lg:px-50 md:px-30 flex flex-1 flex-col gap-10 items-center overflow-y-auto box-border",
        className,
      )}
      onWheel={handleWheel}
    >
      {indicatorDirection !== 0 && resistance > 0 && (
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full border border-primary/30 bg-background/80 px-3 py-2 text-primary shadow-lg backdrop-blur-sm transition-all duration-200 animate-bounce",
            indicatorDirection > 0 ? "bottom-6" : "top-6",
          )}
          aria-hidden="true"
        >
          {indicatorDirection > 0 ? (
            <ChevronDown className="h-7 w-7" />
          ) : (
            <ChevronUp className="h-7 w-7" />
          )}
        </div>
      )}
      {children}
    </div>
  );
}
