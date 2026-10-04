"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onOpenChange,
  children,
  className,
  label,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
            onClick={() => onOpenChange(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={cn(
              "glass-strong relative z-10 w-full max-w-lg overflow-hidden rounded-3xl",
              className,
            )}
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-white/[0.05] p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Tutup"
            >
              <X className="size-4" />
            </button>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

/** Small hook: run a callback when the user clicks 3 times in quick succession. */
export function useTripleClick(onTrigger: () => void, windowMs = 700) {
  const clicks = React.useRef<number[]>([]);

  return React.useCallback(() => {
    const now = Date.now();
    clicks.current = [...clicks.current, now].filter((time) => now - time < windowMs);

    if (clicks.current.length >= 3) {
      clicks.current = [];
      onTrigger();
    }
  }, [onTrigger, windowMs]);
}