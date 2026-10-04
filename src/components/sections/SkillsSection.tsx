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

  if (!skills.length) return null;

  return (
    <section id="skills" className="relative scroll-mt-24 py-20 sm:py-28">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">03 — Skills</span>
          <h2 className="editorial-title mt-3 text-4xl font-light sm:text-5xl">
            Programming <span className="italic text-ember">Skills</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tools dan teknologi yang saya gunakan sehari-hari untuk membangun produk
          digital.
        </p>
      </header>

      {/* Category filter */}
      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs transition-all duration-300",
              activeCategory === category
                ? "border-ember/50 bg-ember/12 text-ember-soft"
                : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:text-foreground",
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

            <div className="relative mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{
                  background: skill.colorHex
                    ? `linear-gradient(90deg, ${skill.colorHex}, ${skill.colorHex}aa)`
                    : "linear-gradient(90deg, #ff6a3d, #ff8a63)",
                  boxShadow: `0 0 14px -2px ${skill.colorHex ?? "#ff6a3d"}99`,
                }}
              />
            </div>

            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground/60">
              {SKILL_CATEGORY_LABELS[skill.category] ?? skill.category}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}