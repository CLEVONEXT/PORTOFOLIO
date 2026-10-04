"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bell,
  Boxes,
  Cpu,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Music4,
  Route,
  Share2,
  X,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { ADMIN_SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/field";
import { CertificatesAdminSection } from "@/components/admin/CertificatesAdminSection";
import { ExperiencesAdminSection } from "@/components/admin/ExperiencesAdminSection";
import { MessagesAdminSection } from "@/components/admin/MessagesAdminSection";
import { OverviewSection } from "@/components/admin/OverviewSection";
import { PlaylistAdminSection } from "@/components/admin/PlaylistAdminSection";
import { ProjectsAdminSection } from "@/components/admin/ProjectsAdminSection";
import { SkillsAdminSection } from "@/components/admin/SkillsAdminSection";
import { SocialAdminSection } from "@/components/admin/SocialAdminSection";
import type { AdminDashboardProps, SectionId } from "@/components/admin/types";

const SECTION_ICONS: Record<string, React.ElementType> = {
  overview: LayoutDashboard,
  projects: Boxes,
  certificates: Award,
  experiences: Route,
  skills: Cpu,
  playlist: Music4,
  social: Share2,
  messages: Inbox,
};

/**
 * Full-screen glassmorphism enterprise dashboard.
 * Layout: fixed glass sidebar + scrollable content canvas with an aurora
 * backdrop, a sticky glass topbar, and animated section transitions.
 */
export function AdminDashboard({
  user,
  settings,
  projects,
  certificates,
  experiences,
  skills,
  songs,
  messages,
  actions,
}: AdminDashboardProps) {
  const [section, setSection] = React.useState<SectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const unread = messages.filter((message) => !message.read).length;
  const current = ADMIN_SECTIONS.find((item) => item.id === section);

  const renderSection = () => {
    switch (section) {
      case "projects":
        return <ProjectsAdminSection projects={projects} actions={actions} />;
      case "certificates":
        return <CertificatesAdminSection certificates={certificates} actions={actions} />;
      case "experiences":
        return <ExperiencesAdminSection experiences={experiences} actions={actions} />;
      case "skills":
        return <SkillsAdminSection skills={skills} actions={actions} />;
      case "playlist":
        return <PlaylistAdminSection songs={songs} actions={actions} />;
      case "social":
        return <SocialAdminSection settings={settings} />;
      case "messages":
        return <MessagesAdminSection messages={messages} actions={actions} />;
      default:
        return (
          <OverviewSection
            projects={projects}
            certificates={certificates}
            experiences={experiences}
            songs={songs}
            messages={messages}
            onNavigate={setSection}
          />
        );
    }
  };

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {ADMIN_SECTIONS.map((item) => {
        const Icon = SECTION_ICONS[item.id] ?? LayoutDashboard;
        const isActive = section === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setSection(item.id);
              onNavigate?.();
            }}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors duration-300",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="admin-nav-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface2))]"
              />
            ) : null}

            <Icon className={cn("relative z-10 size-4", isActive && "text-[rgb(var(--ink))]")} />
            <span className="relative z-10 font-medium">{item.label}</span>

            {item.id === "messages" && unread ? (
              <span className="relative z-10 ml-auto grid size-5 place-items-center rounded-full bg-[rgb(var(--cta))] text-[0.62rem] font-semibold text-[rgb(var(--cta-fg))]">
                {unread}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[rgb(var(--bg))]">
      {/* Ambient glassmorphism backdrop */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 grid-lines opacity-[0.22]" />
        </div>

      <div className="relative flex min-h-screen">
        {/* ── Desktop sidebar ──────────────────────────────────────────── */}
        <aside className="glass fixed inset-y-0 left-0 z-30 hidden w-[268px] flex-col justify-between rounded-r-3xl border-l-0 px-5 py-7 lg:flex">
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-1 px-1">
              <span className="editorial-title text-lg font-light">
                Clevonext<span className="text-[rgb(var(--ink-mute))]">.Dev</span>
              </span>
              <span className="eyebrow text-[0.55rem]">Admin Console</span>
            </div>

            <NavList />
          </div>

          <div className="flex flex-col gap-4">
            <div className="glass-subtle flex items-center gap-3 rounded-2xl p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[rgb(var(--cta))] text-xs font-semibold text-[rgb(var(--cta-fg))]">
                {(user.name ?? user.email ?? "A").slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{user.name ?? "Administrator"}</p>
                <p className="truncate text-[0.65rem] text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" />
                Keluar
              </button>
            </form>
          </div>
        </aside>

        {/* ── Mobile drawer ────────────────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-[rgb(var(--bg))]/90 lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="glass-strong fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col justify-between rounded-r-3xl px-5 py-7 lg:hidden"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="editorial-title text-lg font-light">
                        Clevonext<span className="text-[rgb(var(--ink-mute))]">.Dev</span>
                      </span>
                      <span className="eyebrow text-[0.55rem]">Admin Console</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      aria-label="Tutup menu"
                      className="rounded-lg border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-2"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <NavList onNavigate={() => setSidebarOpen(false)} />
                </div>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="size-4" />
                    Keluar
                  </button>
                </form>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        {/* ── Content canvas ───────────────────────────────────────────── */}
        <div className="flex min-h-screen w-full flex-col lg:pl-[268px]">
          {/* Topbar */}
          <header className="glass sticky top-0 z-20 flex items-center gap-4 border-x-0 border-t-0 px-5 py-4 sm:px-7">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
              className="rounded-lg border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-2 lg:hidden"
            >
              <Menu className="size-4" />
            </button>

            <div className="min-w-0">
              <h1 className="editorial-title truncate text-lg font-light">
                {current?.label ?? "Dashboard"}
              </h1>
              <p className="hidden text-[0.68rem] text-muted-foreground sm:block">
                Kelola seluruh konten portofolio dari satu tempat.
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Badge tone="accent" className="hidden sm:inline-flex">
                <span className="size-1.5 rounded-full bg-[rgb(var(--cta))]" />
                Live Database
              </Badge>

              <button
                type="button"
                onClick={() => setSection("messages")}
                aria-label="Pesan"
                className="relative grid size-9 place-items-center rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Bell className="size-4" />
                {unread ? (
                  <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-[rgb(var(--cta))]" />
                ) : null}
              </button>

              <span className="hidden size-9 place-items-center rounded-xl bg-[rgb(var(--cta))] text-[0.7rem] font-semibold text-[rgb(var(--cta-fg))] sm:grid">
                {(user.name ?? user.email ?? "A").slice(0, 2).toUpperCase()}
              </span>
            </div>
          </header>

          {/* Section body */}
          <main className="flex-1 px-5 py-7 sm:px-7 sm:py-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-full max-w-[1400px]"
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="px-5 pb-7 pt-2 text-center text-[0.68rem] text-muted-foreground sm:px-7">
            Clevonext.Dev Admin Console · {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </div>
  );
}