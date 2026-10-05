"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SKILL_CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type SkillView = {
  id: string;
  name: string;
  category: string;
  level: number;
  colorHex?: string | null;
};

const CATEGORY_ORDER = ["FRONTEND", "BACKEND", "TOOLS", "CLOUD", "DESIGN", "OTHER"];

export function SkillsSection({ skills }: { skills: SkillView[] }) {
  const [activeCategory, setActiveCategory] = React.useState<string>("ALL");

  const categories = React.useMemo(() => {
    const present = new Set(skills.map((skill) => skill.category));
    return ["ALL", ...CATEGORY_ORDER.filter((category) => present.has(category))];
  }, [skills]);

  const visible = React.useMemo(
    () => (activeCategory === "ALL" ? skills : skills.filter((s) => s.category === activeCategory)),
    [skills, activeCategory],
  );

  // Always render so the navbar anchor (id="skills") always exists.
  const empty = skills.length === 0;

  return (
    <section id="skills" className="relative scroll-mt-24 py-20 sm:py-28">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">03 — Skills</span>
          <h2 className="editorial-title mt-3 text-4xl font-light sm:text-5xl">
            Programming <span className="italic text-[rgb(var(--ink))]">Skills</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tools dan teknologi yang saya gunakan sehari-hari untuk membangun produk
          digital.
        </p>
      </header>

      {/* Category filter */}
      {empty ? (
        <div className="mt-10 grid place-items-center rounded-3xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-14 text-center">
          <div>
            <p className="text-sm text-[rgb(var(--ink-dim))]">Belum ada keahlian yang ditampilkan.</p>
            <p className="mt-1 text-xs text-[rgb(var(--ink-mute))]">
              Keahlian akan muncul di sini setelah ditambahkan lewat dashboard admin.
            </p>
          </div>
        </div>
      ) : (
      <>
      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs transition-all duration-300",
              activeCategory === category
                ? "border-[rgb(var(--line-strong))] bg-[rgb(var(--cta))] text-[rgb(var(--cta-fg))]"
                : "border-[rgb(var(--line))] bg-[rgb(var(--surface))] text-[rgb(var(--ink-dim))] hover:border-[rgb(var(--line-strong))] hover:text-[rgb(var(--ink))]",
            )}
          >
            {category === "ALL" ? "Semua" : SKILL_CATEGORY_LABELS[category] ?? category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
        {visible.map((skill, index) => (
          <motion.div
            key={skill.id}
            layout
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium tracking-tight">{skill.name}</span>
              <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                {skill.level}%
              </span>
            </div>

            <div className="relative mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[rgb(var(--line))]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-[rgb(var(--cta))]"
              />
            </div>

            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground/60">
              {SKILL_CATEGORY_LABELS[skill.category] ?? skill.category}
            </p>
          </motion.div>
        ))}
      </div>
      </>
      )}
    </section>
  );
}