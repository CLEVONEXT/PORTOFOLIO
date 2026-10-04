"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify, toArray } from "@/lib/utils";
import {
  projectSchema,
  certificateSchema,
  experienceSchema,
  skillSchema,
  songSchema,
  settingsSchema,
} from "@/lib/validations";

/* ── Shared result contract ───────────────────────────────────────────────── */
export type ActionResult = {
  ok: boolean;
  message: string;
  id?: string;
};

const REVALIDATE = ["/", "/admin"];

function revalidateAll() {
  REVALIDATE.forEach((path) => revalidatePath(path));
}

async function requireAdmin(): Promise<string | null> {
  const session = await auth();
  if (!session?.user) return "Sesi tidak valid. Silakan login ulang.";
  if (session.user.role && session.user.role !== "ADMIN") {
    return "Anda tidak memiliki akses admin.";
  }
  return null;
}

function fromZod(error: z.ZodError): ActionResult {
  return {
    ok: false,
    message: error.issues[0]?.message ?? "Data tidak valid.",
  };
}

/* ── Projects ─────────────────────────────────────────────────────────────── */

export async function saveProject(raw: unknown): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);

  const { id, techStack, ...data } = parsed.data;
  const payload = {
    ...data,
    slug: data.slug?.trim() ? slugify(data.slug) : slugify(data.title),
    techStack: toArray(techStack),
    coverImage: data.coverImage || null,
    demoUrl: data.demoUrl || null,
    repoUrl: data.repoUrl || null,
    summary: data.summary || null,
    description: data.description || null,
    category: data.category || null,
  };

  try {
    const record = id
      ? await prisma.project.update({ where: { id }, data: payload })
      : await prisma.project.create({ data: payload });
    revalidateAll();
    return {
      ok: true,
      message: id ? "Proyek diperbarui." : "Proyek ditambahkan.",
      id: record.id,
    };
  } catch (error) {
    const message = (error as Error).message.includes("Unique")
      ? "Slug sudah digunakan, gunakan judul lain."
      : "Gagal menyimpan proyek.";
    return { ok: false, message };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };
  try {
    await prisma.project.delete({ where: { id } });
    revalidateAll();
    return { ok: true, message: "Proyek dihapus." };
  } catch {
    return { ok: false, message: "Gagal menghapus proyek." };
  }
}

/* ── Certificates ─────────────────────────────────────────────────────────── */

export async function saveCertificate(raw: unknown): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };

  const parsed = certificateSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);

  const { id, skills, issuedAt, expiresAt, ...data } = parsed.data;
  const payload = {
    ...data,
    skills: toArray(skills),
    issuedAt: issuedAt ? new Date(issuedAt) : null,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    fileUrl: data.fileUrl || null,
    thumbnailUrl: data.thumbnailUrl || null,
    issuerLogo: data.issuerLogo || null,
    verifyUrl: data.verifyUrl || null,
    credentialId: data.credentialId || null,
  };

  try {
    const record = id
      ? await prisma.certificate.update({ where: { id }, data: payload })
      : await prisma.certificate.create({ data: payload });
    revalidateAll();
    return { ok: true, message: "Sertifikat disimpan.", id: record.id };
  } catch {
    return { ok: false, message: "Gagal menyimpan sertifikat." };
  }
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };
  try {
    await prisma.certificate.delete({ where: { id } });
    revalidateAll();
    return { ok: true, message: "Sertifikat dihapus." };
  } catch {
    return { ok: false, message: "Gagal menghapus sertifikat." };
  }
}

/* ── Experiences ──────────────────────────────────────────────────────────── */

export async function saveExperience(raw: unknown): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };

  const parsed = experienceSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);

  const { id, tags, startDate, endDate, isCurrent, ...data } = parsed.data;
  const payload = {
    ...data,
    tags: toArray(tags),
    startDate: new Date(startDate),
    endDate: isCurrent || !endDate ? null : new Date(endDate),
    isCurrent,
    location: data.location || null,
    description: data.description || null,
    logoUrl: data.logoUrl || null,
  };

  try {
    const record = id
      ? await prisma.experience.update({ where: { id }, data: payload })
      : await prisma.experience.create({ data: payload });
    revalidateAll();
    return { ok: true, message: "Pengalaman disimpan.", id: record.id };
  } catch {
    return { ok: false, message: "Gagal menyimpan pengalaman." };
  }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };
  try {
    await prisma.experience.delete({ where: { id } });
    revalidateAll();
    return { ok: true, message: "Pengalaman dihapus." };
  } catch {
    return { ok: false, message: "Gagal menghapus pengalaman." };
  }
}

/* ── Skills ───────────────────────────────────────────────────────────────── */

export async function saveSkill(raw: unknown): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };

  const parsed = skillSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);

  const { id, ...data } = parsed.data;
  const payload = {
    ...data,
    colorHex: data.colorHex || null,
    iconUrl: data.iconUrl || null,
  };

  try {
    const record = id
      ? await prisma.skill.update({ where: { id }, data: payload })
      : await prisma.skill.create({ data: payload });
    revalidateAll();
    return { ok: true, message: "Skill disimpan.", id: record.id };
  } catch {
    return { ok: false, message: "Gagal menyimpan skill." };
  }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };
  try {
    await prisma.skill.delete({ where: { id } });
    revalidateAll();
    return { ok: true, message: "Skill dihapus." };
  } catch {
    return { ok: false, message: "Gagal menghapus skill." };
  }
}

/* ── Songs ────────────────────────────────────────────────────────────────── */

export async function saveSong(raw: unknown): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };

  const parsed = songSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);

  const { id, ...data } = parsed.data;
  const payload = {
    ...data,
    album: data.album || null,
    coverArt: data.coverArt || null,
    audioUrl: data.audioUrl || null,
    spotifyUrl: data.spotifyUrl || null,
    spotifyEmbed: data.spotifyEmbed || null,
    mood: data.mood || null,
    durationSec: data.durationSec || null,
  };

  try {
    const record = id
      ? await prisma.song.update({ where: { id }, data: payload })
      : await prisma.song.create({ data: payload });
    revalidateAll();
    return { ok: true, message: "Lagu disimpan.", id: record.id };
  } catch {
    return { ok: false, message: "Gagal menyimpan lagu." };
  }
}

export async function deleteSong(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };
  try {
    await prisma.song.delete({ where: { id } });
    revalidateAll();
    return { ok: true, message: "Lagu dihapus." };
  } catch {
    return { ok: false, message: "Gagal menghapus lagu." };
  }
}

export async function reorderSongs(ids: string[]): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };
  try {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.song.update({ where: { id }, data: { sortOrder: index } }),
      ),
    );
    revalidateAll();
    return { ok: true, message: "Urutan lagu diperbarui." };
  } catch {
    return { ok: false, message: "Gagal memperbarui urutan lagu." };
  }
}

/* ── Settings ─────────────────────────────────────────────────────────────── */

export async function saveSettings(raw: unknown): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return fromZod(parsed.error);

  try {
    await prisma.$transaction(
      Object.entries(parsed.data).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: String(value ?? "") },
          create: { key, value: String(value ?? "") },
        }),
      ),
    );
    revalidateAll();
    return { ok: true, message: "Pengaturan disimpan." };
  } catch {
    return { ok: false, message: "Gagal menyimpan pengaturan." };
  }
}

/* ── Messages ─────────────────────────────────────────────────────────────── */

export async function markMessageRead(
  id: string,
  read = true,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };
  try {
    await prisma.message.update({ where: { id }, data: { read } });
    revalidatePath("/admin");
    return {
      ok: true,
      message: read ? "Ditandai sudah dibaca." : "Ditandai belum dibaca.",
    };
  } catch {
    return { ok: false, message: "Gagal memperbarui pesan." };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return { ok: false, message: denied };
  try {
    await prisma.message.delete({ where: { id } });
    revalidatePath("/admin");
    return { ok: true, message: "Pesan dihapus." };
  } catch {
    return { ok: false, message: "Gagal menghapus pesan." };
  }
}
