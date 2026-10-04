"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/field";

export type ProjectView = {
  id: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  coverImage?: string | null;
  techStack: string[];
  demoUrl?: string | null;
  repoUrl?: string | null;
  category?: string | null;
  year?: number | null;
  featured: boolean;
};

export function ProjectsSection({ projects }: { projects: ProjectView[] }) {
  if (!projects.length) return null;

  return (
    <section id="projects" className="relative scroll-mt-24 py-20 sm:py-28">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">02 — Projects</span>
          <h2 className="editorial-title mt-3 text-4xl font-light sm:text-5xl">
            Daftar <span className="italic text-ember">Karya</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Kumpulan proyek yang saya kerjakan — dari eksperimen pribadi hingga
          kolaborasi tim.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "glass glass-glow group relative flex flex-col overflow-hidden rounded-3xl",
              project.featured && "sm:col-span-2 lg:col-span-1",
            )}
          >
            {/* Cover */}
            <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.07] bg-white/[0.03]">
              {project.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.coverImage}
                  alt={project.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              ) : (
                <div className="grid size-full place-items-center">
                  <ImageIcon className="size-7 text-muted-foreground/40" />
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-70" />

              <div className="absolute left-4 top-4 flex gap-2">
                {project.category ? <Badge tone="glow">{project.category}</Badge> : null}
                {project.year ? <Badge tone="muted">{project.year}</Badge> : null}
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="editorial-title text-xl font-light leading-snug transition-colors group-hover:text-ember">
                {project.title}
              </h3>

              {project.summary ? (
                <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
              ) : null}

              {project.techStack.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} tone="muted">
                      {tech}
                    </Badge>
                  ))}
                </div>
              ) : null}

              <div className="mt-auto flex items-center gap-3 pt-6">
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-transform hover:scale-[1.03]"
                  >
                    Live Demo
                    <ArrowUpRight className="size-3.5" />
                  </a>
                ) : null}

                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2 text-xs text-foreground/85 transition-colors hover:border-white/25 hover:text-foreground"
                  >
                    <Github className="size-3.5" />
                    Repository
                  </a>
                ) : null}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}