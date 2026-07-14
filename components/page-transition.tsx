"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type TransitionPhase = "cover" | "reveal" | null;

type TransitionContextValue = {
  navigate: (href: string) => void;
};

const PageTransitionContext = createContext<TransitionContextValue | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<TransitionPhase>(null);
  const timers = useRef<number[]>([]);
  const pendingHref = useRef<string | null>(null);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (!pendingHref.current || phase !== "reveal") return;
    timers.current.push(window.setTimeout(() => {
      setPhase(null);
      pendingHref.current = null;
    }, 520));
  }, [pathname, phase]);

  const navigate = (href: string) => {
    if (href === pathname || href === `${pathname}#work`) return;
    clearTimers();

    if (reducedMotion) {
      router.push(href);
      return;
    }

    pendingHref.current = href;
    setPhase("cover");
    timers.current.push(
      window.setTimeout(() => {
        router.push(href);
        setPhase("reveal");
      }, 520),
    );
  };

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}
      <BarWipe phase={phase} />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return context;
}

function BarWipe({ phase }: { phase: TransitionPhase }) {
  return (
    <AnimatePresence>
      {phase ? (
        <motion.div className="bar-wipe" aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {Array.from({ length: 8 }, (_, index) => (
            <motion.i
              key={index}
              initial={{ scaleX: phase === "cover" ? 0 : 1 }}
              animate={{ scaleX: phase === "cover" ? 1 : 0 }}
              transition={{
                duration: 0.28,
                delay: (phase === "cover" ? index : 7 - index) * 0.034,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
