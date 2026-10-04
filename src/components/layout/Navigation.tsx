"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Home, User, FolderCode, Cpu, Award, Mail } from "lucide-react";
import { NAV_ITEMS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<string, React.ElementType> = {
  home: Home,
  about: User,
  projects: FolderCode,
  skills: Cpu,
  certificates: Award,
  contact: Mail,
};

/**
 * Responsive navigation:
 *  - Desktop (≥lg): top navbar, solid #1E1E1E surface with #FFFFFF text.
 *  - Mobile (<lg): fixed bottom navbar, icon-driven, white icons on black.
 * Active section is tracked with IntersectionObserver.
 */
export function Navigation() {
  const [active, setActive] = React.useState<string>("home");

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
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = React.useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      // Fallback: section not rendered (empty data) — scroll as far as
      // possible so the click is never a dead end.
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      {/* ── Desktop: top navbar ─────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-40 hidden lg:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="editorial-title text-[1.15rem] font-light text-[rgb(var(--ink))]"
          >
            Clevonext<span className="text-[rgb(var(--ink-mute))]">.Dev</span>
          </button>

          <nav className="flex items-center gap-1 rounded-full border border-[rgb(var(--line))] bg-[rgb(var(--surface))] px-2 py-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm transition-colors duration-300",
                    isActive
                      ? "text-[rgb(var(--cta-fg))]"
                      : "text-[rgb(var(--ink-dim))] hover:text-[rgb(var(--ink))]",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-[rgb(var(--cta))]"
                    />
                  ) : null}
                  <span className="relative z-10 font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-[0.68rem] uppercase tracking-[0.28em] text-[rgb(var(--ink-mute))]">
              {SITE.major}
            </span>
          </div>
        </div>
      </header>

      {/* ── Mobile: floating bottom navigation ────────────────────────── */}
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-40 px-3 lg:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <div className="mx-auto max-w-md rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
          <div className="grid grid-cols-6 gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = NAV_ICONS[item.id] ?? Home;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.hint}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "flex min-w-0 flex-col items-center gap-1 rounded-xl px-0.5 py-1.5 text-[0.5rem] leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ink))]",
                    isActive ? "text-[rgb(var(--ink))]" : "text-[rgb(var(--ink-mute))]",
                  )}
                >
                  <span className="relative grid size-8 place-items-center">
                    {isActive ? (
                      <motion.span
                        layoutId="bottom-nav-indicator"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-[rgb(var(--cta))]"
                      />
                    ) : null}
                    <Icon
                      className={cn(
                        "relative z-10 size-[18px] transition-colors duration-300",
                        isActive ? "text-[rgb(var(--cta-fg))]" : "text-[rgb(var(--ink-mute))]",
                      )}
                      strokeWidth={isActive ? 2.4 : 1.8}
                    />
                  </span>
                  <span className="max-w-full truncate">
                    {item.id === "certificates" ? "Certs" : item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
