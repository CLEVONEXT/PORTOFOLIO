"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

const BRAND = "Clevonext.dev";
const STORAGE_KEY = "clevonext:splash-seen";
const HOLD_MS = 1850;

/**
 * Minimalist editorial splash screen.
 * Letters reveal one by one, then the whole curtain lifts away.
 * Shown once per session (sessionStorage) so navigation stays fast.
 */
export function SplashScreen({ force = false }: { force?: boolean }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (force) {
      setVisible(true);
    } else {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      if (!seen) setVisible(true);
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [force]);

  // Lock scroll while the curtain is up
  React.useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const letters = React.useMemo(() => BRAND.split(""), []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[rgb(var(--bg))]"
        >
          {/* Solid grid only — no gradient */}
          <div className="absolute inset-0 grid-lines opacity-25" />

          {/* Curtains sliding away */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="absolute inset-x-0 top-0 h-1/2 bg-[rgb(var(--bg))]"
          />
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[rgb(var(--bg))]"
          />

          <div className="relative z-10 flex flex-col items-center gap-8 px-6">
            <h1
              className="editorial-title flex items-baseline text-4xl font-light sm:text-6xl md:text-7xl"
              aria-label={BRAND}
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.72,
                    delay: 0.12 + index * 0.055,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={letter === "." ? "text-[rgb(var(--ink-mute))]" : "text-[rgb(var(--ink))]"}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-56 origin-left bg-[rgb(var(--line-strong))] sm:w-80"
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95 }}
              className="eyebrow"
            >
              Software Engineering Portfolio
            </motion.p>
          </div>

          {/* Loading sweep */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 h-px w-1/2 bg-[rgb(var(--ink-mute))]"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}