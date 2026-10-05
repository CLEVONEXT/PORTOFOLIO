"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Briefcase, GraduationCap, MapPin, Sparkles, Users } from "lucide-react";
import { EXPERIENCE_TYPE_LABELS, SITE } from "@/lib/constants";
import { cn, formatRange } from "@/lib/utils";
import { Badge } from "@/components/ui/field";
import { MusicPlayer, type SongView } from "@/components/sections/MusicPlayer";
import LogoLoop, { type LogoItem } from "@/components/reactbits/LogoLoop";

/** Partner / collaborator logos shown in the About section. */
const featuredLogos: LogoItem[] = [
  { name: "Clevonext.Dev", src: "/icons/icon-192.png" },
  { name: "Vercel", src: "https://cdn.simpleicons.org/vercel/white" },
  { name: "Next.js", src: "https://cdn.simpleicons.org/nextdotjs/white" },
  { name: "GitHub", src: "https://cdn.simpleicons.org/github/white" },
  { name: "TypeScript", src: "https://cdn.simpleicons.org/typescript/white" },
  { name: "Figma", src: "https://cdn.simpleicons.org/figma/white" },
];

export type ExperienceView = {
  id: string;
  title: string;
  organization: string;
  type: string;
  location?: string | null;
  description?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  isCurrent: boolean;
  tags: string[];
};

const TYPE_ICON: Record<string, React.ElementType> = {
  EDUCATION: GraduationCap,
  COLLEGE: GraduationCap,
  WORK: Briefcase,
  ORGANIZATION: Users,
  ACHIEVEMENT: Sparkles,
};

/* ── Interactive profile photo card ──────────────────────────────────────── */
function ProfileCard({
  photo,
  name,
  major,
  bio,
}: {
  photo?: string;
  name: string;
  major: string;
  bio?: string;
}) {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });

  const glare = useMotionTemplate`radial-gradient(320px circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.10), transparent 65%)`;

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
    rotateY.set((x - 50) / 14);
    rotateX.set(-(y - 50) / 14);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(50);
    mouseY.set(50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className="w-full max-w-sm"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-3xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-3"
      >
        {/* Photo */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface2))]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={name}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="grid size-full place-items-center">
              <span className="editorial-title text-6xl font-light text-[rgb(var(--ink-mute))]">
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
          )}

          {/* Dynamic glare */}
          <motion.div
            style={{ background: glare }}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[rgb(var(--bg))]/85" />

          <Badge tone="accent" className="absolute left-3 top-3">
            <span className="size-1.5 rounded-full bg-[rgb(var(--cta))]" />
            Open to work
          </Badge>
        </div>

        {/* Identity */}
        <div className="flex flex-col gap-1 px-3 pb-2 pt-4">
          <p className="eyebrow text-[0.58rem]">Nama</p>
          <p className="editorial-title text-lg font-light leading-tight">{name}</p>
          <div className="mt-2 hairline pt-3">
            <p className="eyebrow text-[0.58rem]">Jurusan</p>
            <p className="text-sm text-[rgb(var(--ink))]">{major}</p>
          </div>
        </div>
      </motion.div>

      {bio ? (
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{bio}</p>
      ) : null}
    </motion.div>
  );
}

/* ── Timeline ────────────────────────────────────────────────────────────── */
function ExperienceTimeline({ experiences }: { experiences: ExperienceView[] }) {
  if (!experiences.length) return null;

  return (
    <div className="relative mt-10">
      <div className="absolute left-[13px] top-2 h-[calc(100%-1rem)] w-px bg-[rgb(var(--line))]" />

      <ul className="space-y-8">
        {experiences.map((item, index) => {
          const Icon = TYPE_ICON[item.type] ?? Sparkles;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="relative pl-11"
            >
              <span
                className={cn(
                  "absolute left-0 top-1 grid size-[27px] place-items-center rounded-full border bg-[rgb(var(--surface))]",
                  item.isCurrent
                    ? "border-[rgb(var(--line-strong))] text-[rgb(var(--ink))]"
                    : "border-[rgb(var(--line))] text-[rgb(var(--ink-mute))]",
                )}
              >
                <Icon className="size-3.5" />
              </span>

              <div className="rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-5 transition-colors duration-300 hover:border-[rgb(var(--line-strong))]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Badge tone={item.isCurrent ? "accent" : "muted"}>
                    {EXPERIENCE_TYPE_LABELS[item.type] ?? item.type}
                  </Badge>
                  <span className="font-mono text-[0.7rem] text-muted-foreground">
                    {formatRange(item.startDate, item.endDate, item.isCurrent)}
                  </span>
                  {item.location ? (
                    <span className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                      <MapPin className="size-3" />
                      {item.location}
                    </span>
                  ) : null}
                </div>

                <h4 className="mt-3 text-base font-medium tracking-tight">{item.title}</h4>
                <p className="text-sm text-[rgb(var(--ink))]/90">{item.organization}</p>

                {item.description ? (
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}

                {item.tags.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag} tone="muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export function AboutSection({
  bio,
  photo,
  name = SITE.owner,
  major = SITE.major,
  experiences,
  songs,
}: {
  bio?: string;
  photo?: string;
  name?: string;
  major?: string;
  experiences: ExperienceView[];
  songs: SongView[];
}) {
  return (
    <section id="about" className="relative scroll-mt-24 py-20 sm:py-28">
      <header className="flex flex-col gap-3">
        <span className="eyebrow">01 — About</span>
        <h2 className="editorial-title text-4xl font-light sm:text-5xl">
          Tentang <span className="italic text-[rgb(var(--ink))]">Saya</span>
        </h2>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        {/* Text column */}
        <div className="order-2 lg:order-1">
          <div className="space-y-5 text-[0.95rem] leading-relaxed text-muted-foreground">
            {(bio ?? "").split("\n").filter(Boolean).map((paragraph, index) => (
              <p key={index} className="text-balance">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="eyebrow">Experience & Education</h3>
            <ExperienceTimeline experiences={experiences} />
          </div>
        </div>

        {/* Card + playlist column */}
        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <ProfileCard photo={photo} name={name} major={major} />
            <aside className="sm:max-w-[220px]">
              <h3 className="eyebrow">Sekolah</h3>
              <p className="mt-3 text-sm font-medium leading-snug text-[rgb(var(--ink))]">
                SMK Krian 1 Sidoarjo
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Jurusan Software Engineering
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Saya bersekolah di SMK Krian 1 Sidoarjo, mengambil jurusan
                Software Engineering. Di sini saya belajar membangun aplikasi
                modern — mulai dari desain antarmuka, pengembangan frontend &amp;
                backend, hingga praktik kerja proyek nyata.
              </p>
            </aside>
          </div>
          <MusicPlayer songs={songs} />
        </div>
      </div>

      {/* Collaborators & partners marquee */}
      <div className="mt-14">
        <LogoLoop
          logos={featuredLogos}
          speed={50}
          direction="left"
          logoHeight={36}
          gap={48}
          pauseOnHover
          scaleOnHover
          fadeOut
          ariaLabel="Daftar kolaborator dan mitra"
        />
      </div>
    </section>
  );
}