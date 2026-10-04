"use client";

import * as React from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, SITE } from "../../lib/constants";
import { cn } from "../../lib/utils";

/**
 * Vertical left navbar (desktop) / slide-in drawer (mobile).
 * Tracks the active section with IntersectionObserver and shows a
 * scroll progress rail on the far left edge.
 */
export function LeftNavbar() {
  const [active, setActive] = React.useState<string>("home");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  /* ── Active section tracking ───────────────────────────────────────────── */
  React.useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (element): element is HTMLElement => Boolean(element),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = React.useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setDrawerOpen(false);
  }, []);

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1.5">
      {NAV_ITEMS.map((item, index) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              scrollTo(item.id);
              onNavigate?.();
            }}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-300",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="nav-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.06]"
              />
            ) : null}
            <span className="relative z-10 font-mono text-[0.62rem] tabular-nums opacity-60">
              0{index + 1}
            </span>
            <span className="relative z-10 text-sm font-medium tracking-tight">
              {item.label}
            </span>
            <span
              className={cn(
                "relative z-10 ml-auto h-px bg-ember transition-all duration-300",
                isActive ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-60",
              )}
            />
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Scroll progress rail */}
      <motion.div
        style={{ scaleY: progress }}
        className="fixed left-0 top-0 z-40 hidden h-full w-[2px] origin-top bg-gradient-to-b from-ember via-ember-soft to-transparent lg:block"
      />

      {/* Desktop vertical navbar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col justify-between px-7 py-10 lg:flex">
        <div className="flex flex-col gap-12">
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="group flex flex-col items-start gap-1 text-left"
          >
            <span className="editorial-title text-[1.35rem] font-light text-foreground">
              Clevonext<span className="text-ember">.Dev</span>
            </span>
            <span className="eyebrow text-[0.6rem]">{SITE.major}</span>
          </button>

          <NavList />
        </div>

        <div className="flex flex-col gap-4">
          <div className="hairline pt-5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {SITE.owner}
              <br />
              <span className="opacity-60">© {new Date().getFullYear()}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[0.68rem] text-muted-foreground">
              Available for collaboration
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 lg:hidden">
        <div className="glass-subtle flex w-full items-center justify-between rounded-2xl px-4 py-3">
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="editorial-title text-base font-light"
          >
            Clevonext<span className="text-ember">.Dev</span>
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka menu"
            className="rounded-lg border border-white/10 bg-white/[0.05] p-2 text-foreground"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[60] bg-ink-950/75 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="glass-strong fixed inset-y-0 left-0 z-[70] flex w-[280px] flex-col justify-between rounded-r-3xl px-6 py-7 lg:hidden"
            >
              <div className="flex flex-col gap-9">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="editorial-title text-xl font-light">
                      Clevonext<span className="text-ember">.Dev</span>
                    </span>
                    <span className="eyebrow text-[0.58rem]">{SITE.major}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Tutup menu"
                    className="rounded-lg border border-white/10 bg-white/[0.05] p-2"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <NavList onNavigate={() => setDrawerOpen(false)} />
              </div>

              <p className="text-xs text-muted-foreground">
                {SITE.owner} · © {new Date().getFullYear()}
              </p>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}