import { cache } from "react";
import { prisma } from "@/lib/prisma";

/* ───────────────────────────────────────────────────────────────────────────
 * Public data access. Every function degrades gracefully: if the database is
 * not reachable (first run / demo mode) it returns an empty/fallback value so
 * the landing page never crashes.
 * ─────────────────────────────────────────────────────────────────────────── */

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(
      "[data] query failed, using fallback:",
      (error as Error).message,
    );
    return fallback;
  }
}

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  return safe(async () => {
    const rows = await prisma.setting.findMany();
    return rows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  }, {});
});

export const getProjects = cache(async (featuredOnly = false) => {
  return safe(
    () =>
      prisma.project.findMany({
        where: {
          status: "PUBLISHED",
          ...(featuredOnly ? { featured: true } : {}),
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
    [],
  );
});

export const getSkills = cache(async () => {
  return safe(
    () =>
      prisma.skill.findMany({
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      }),
    [],
  );
});

export const getCertificates = cache(async () => {
  return safe(
    () => prisma.certificate.findMany({ orderBy: [{ sortOrder: "asc" }] }),
    [],
  );
});

export const getExperiences = cache(async () => {
  return safe(
    () =>
      prisma.experience.findMany({
        orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
      }),
    [],
  );
});

export const getSongs = cache(async () => {
  return safe(
    () =>
      prisma.song.findMany({
        where: { isFavorite: true },
        orderBy: [{ sortOrder: "asc" }],
      }),
    [],
  );
});

/* ── Admin (uncached, full data) ─────────────────────────────────────────── */

export async function getAdminProjects() {
  return safe(
    () => prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }] }),
    [],
  );
}

export async function getAdminCertificates() {
  return safe(
    () => prisma.certificate.findMany({ orderBy: [{ sortOrder: "asc" }] }),
    [],
  );
}

export async function getAdminExperiences() {
  return safe(
    () => prisma.experience.findMany({ orderBy: [{ sortOrder: "asc" }] }),
    [],
  );
}

export async function getAdminSkills() {
  return safe(
    () => prisma.skill.findMany({ orderBy: [{ sortOrder: "asc" }] }),
    [],
  );
}

export async function getAdminSongs() {
  return safe(
    () => prisma.song.findMany({ orderBy: [{ sortOrder: "asc" }] }),
    [],
  );
}

export async function getMessages(limit = 50) {
  return safe(
    () =>
      prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    [],
  );
}

export type SettingsMap = Awaited<ReturnType<typeof getSettings>>;
