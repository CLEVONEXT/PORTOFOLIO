"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, BriefcaseBusiness, Github } from "lucide-react";
import { CertificatesSection, type CertificateView } from "@/components/sections/CertificatesSection";
import { SkillsSection, type SkillView } from "@/components/sections/SkillsSection";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((module) => module.GitHubCalendar),
  {
    ssr: false,
    loading: () => (
      <p className="py-8 text-center text-sm text-muted-foreground" aria-live="polite">
        Memuat aktivitas GitHub...
      </p>
    ),
  },
);

const githubTheme = {
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

type SkillsAndStatsSectionProps = {
  skills: SkillView[];
  certificates: CertificateView[];
};

export function SkillsAndStatsSection({
  skills,
  certificates,
}: SkillsAndStatsSectionProps) {
  return (
    <div className="py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          <SkillsSection skills={skills} />
          <CertificatesSection certificates={certificates} />
        </div>

        <aside className="flex flex-col gap-5 lg:pt-2">
          <section className="glass rounded-2xl p-5" aria-labelledby="availability-title">
            <div className="mb-3 flex items-center gap-3">
              <span className="relative flex size-3" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
              </span>
              <h2
                id="availability-title"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400"
              >
                Available for hire
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[rgb(var(--ink-dim))]">
              Available for freelance and full-time roles.
            </p>
          </section>

          <section className="glass rounded-2xl p-5" aria-labelledby="quick-metrics-title">
            <h2 id="quick-metrics-title" className="eyebrow mb-4">
              Quick metrics
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--bg))] p-4">
                <p className="text-2xl font-semibold tabular-nums">{skills.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Skills</p>
              </div>
              <div className="rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--bg))] p-4">
                <p className="text-2xl font-semibold tabular-nums">{certificates.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Certificates</p>
              </div>
            </div>
            <a
              href="https://github.com/CLEVONEXT"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex min-w-0 items-center gap-3 rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--bg))] px-4 py-3 text-sm transition-colors hover:border-[rgb(var(--line-strong))]"
            >
              <Github className="size-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">CLEVONEXT</span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </a>
          </section>

          <div className="flex items-start gap-3 px-1 text-sm text-muted-foreground">
            <BriefcaseBusiness className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>Building thoughtful software for the web and beyond.</p>
          </div>
        </aside>
      </div>

      <section
        className="glass mt-8 overflow-hidden rounded-2xl p-5 sm:p-7"
        aria-labelledby="github-contributions-title"
      >
        <header className="mb-5 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Activity</span>
            <h2 id="github-contributions-title" className="mt-2 text-xl font-semibold">
              GitHub Contributions
            </h2>
          </div>
          <a
            href="https://github.com/CLEVONEXT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Profile <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </header>

        <div className="hide-scrollbar overflow-x-auto pb-2">
          <div className="flex min-w-[720px] justify-center py-2">
            <GitHubCalendar
              username="CLEVONEXT"
              colorScheme="dark"
              theme={githubTheme}
              blockSize={12}
              blockMargin={4}
              fontSize={12}
            />
          </div>
        </div>
      </section>
    </div>
  );
}