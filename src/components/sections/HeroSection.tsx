"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection({
  tagline,
  owner,
  major,
}: {
  tagline?: string;
  owner?: string;
  major?: string;
}) {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section
      id="home"
      className="relative flex min-h-[92vh] scroll-mt-24 flex-col justify-center py-20"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora-bg animate-aurora" />
        <div className="absolute inset-0 grid-lines opacity-40" />
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
        <motion.p variants={item} className="eyebrow flex items-center gap-3">
          <span className="h-px w-10 bg-ember" />
          Portfolio {new Date().getFullYear()}
        </motion.p>

        <motion.h1
          variants={item}
          className="editorial-title mt-7 text-[3.1rem] font-light leading-[0.92] sm:text-[4.5rem] lg:text-[5.6rem]"
        >
          {owner ?? SITE.owner}
        </motion.h1>

        <motion.div variants={item} className="mt-7 flex flex-col gap-3">
          <p className="text-lg text-muted-foreground sm:text-xl">
            <span className="text-foreground">{major ?? SITE.major}</span> — building
            clean, human-centered digital products.
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground/90">
            {tagline ?? SITE.tagline}
          </p>
        </motion.div>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => scrollTo("projects")}
            className="group inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-medium text-ink-950 shadow-[0_0_38px_-10px_rgba(255,106,61,0.85)] transition-transform hover:scale-[1.03]"
          >
            Lihat Karya
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className="glass-glow inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-6 py-3 text-sm text-foreground transition-colors hover:text-ember"
          >
            <Mail className="size-4" />
            Hubungi Saya
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollTo("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-0 hidden items-center gap-3 text-muted-foreground transition-colors hover:text-foreground sm:flex"
        aria-label="Scroll ke bagian About"
      >
        <span className="grid size-9 place-items-center rounded-full border border-white/12">
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown className="size-4" />
          </motion.span>
        </span>
        <span className="text-[0.68rem] uppercase tracking-[0.28em]">Scroll</span>
      </motion.button>
    </section>
  );
}