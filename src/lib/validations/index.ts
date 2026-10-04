import { z } from "zod";

/* ── Auth ─────────────────────────────────────────────────────────────────── */
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

/* ── Projects ─────────────────────────────────────────────────────────────── */
export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Judul minimal 2 karakter"),
  slug: z.string().optional(),
  summary: z.string().max(220).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  techStack: z.string().optional().or(z.literal("")),
  demoUrl: z.string().url("URL demo tidak valid").optional().or(z.literal("")),
  repoUrl: z.string().url("URL repo tidak valid").optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  sortOrder: z.coerce.number().int().default(0),
});

/* ── Certificates ─────────────────────────────────────────────────────────── */
export const certificateSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(2, "Judul sertifikat wajib diisi"),
    issuer: z.string().min(2, "Penerbit wajib diisi"),
    issuedAt: z.string().optional().or(z.literal("")),
    expiresAt: z.string().optional().or(z.literal("")),
    credentialId: z.string().optional().or(z.literal("")),
    verifyUrl: z.string().optional().or(z.literal("")),
    source: z.enum(["UPLOAD", "EXTERNAL_URL"]).default("UPLOAD"),
    fileUrl: z.string().optional().or(z.literal("")),
    thumbnailUrl: z.string().optional().or(z.literal("")),
    issuerLogo: z.string().optional().or(z.literal("")),
    skills: z.string().optional().or(z.literal("")),
    featured: z.boolean().default(false),
    sortOrder: z.coerce.number().int().default(0),
  })
  .refine((data) => data.source !== "UPLOAD" || Boolean(data.fileUrl), {
    message: "File sertifikat wajib diunggah",
    path: ["fileUrl"],
  })
  .refine((data) => data.source !== "EXTERNAL_URL" || Boolean(data.verifyUrl), {
    message: "URL sertifikat eksternal wajib diisi",
    path: ["verifyUrl"],
  })
  .refine(
    // Business rule: external links MUST carry a supporting thumbnail/icon.
    (data) =>
      data.source !== "EXTERNAL_URL" ||
      Boolean(data.thumbnailUrl || data.issuerLogo),
    {
      message:
        "Untuk upload via link, wajib sertakan thumbnail/logo penerbit (mis. Credly/Coursera)",
      path: ["thumbnailUrl"],
    },
  );

/* ── Experiences ──────────────────────────────────────────────────────────── */
export const experienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Judul wajib diisi"),
  organization: z.string().min(2, "Institusi wajib diisi"),
  type: z.enum(["EDUCATION", "COLLEGE", "ORGANIZATION", "WORK", "ACHIEVEMENT"]),
  location: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  startDate: z.string().min(4, "Tanggal mulai wajib diisi"),
  endDate: z.string().optional().or(z.literal("")),
  isCurrent: z.boolean().default(false),
  logoUrl: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
});

/* ── Skills ───────────────────────────────────────────────────────────────── */
export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama skill wajib diisi"),
  category: z.enum([
    "FRONTEND",
    "BACKEND",
    "TOOLS",
    "CLOUD",
    "DESIGN",
    "OTHER",
  ]),
  level: z.coerce.number().int().min(0).max(100).default(70),
  colorHex: z.string().optional().or(z.literal("")),
  iconUrl: z.string().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
});

/* ── Songs ────────────────────────────────────────────────────────────────── */
export const songSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul lagu wajib diisi"),
  artist: z.string().min(1, "Nama penyanyi wajib diisi"),
  album: z.string().optional().or(z.literal("")),
  coverArt: z.string().optional().or(z.literal("")),
  audioUrl: z.string().optional().or(z.literal("")),
  spotifyUrl: z.string().optional().or(z.literal("")),
  spotifyEmbed: z.string().optional().or(z.literal("")),
  durationSec: z.coerce.number().int().min(0).optional(),
  mood: z.string().optional().or(z.literal("")),
  isFavorite: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

/* ── Settings (social links etc.) ─────────────────────────────────────────── */
export const settingsSchema = z.object({
  "site.brand": z.string().min(1),
  "site.owner": z.string().min(1),
  "site.major": z.string().min(1),
  "site.tagline": z.string().optional().or(z.literal("")),
  "site.email": z.string().email("Email situs tidak valid"),
  "social.instagram": z.string().optional().or(z.literal("")),
  "social.tiktok": z.string().optional().or(z.literal("")),
  "social.telegram": z.string().optional().or(z.literal("")),
  "social.github": z.string().optional().or(z.literal("")),
  "profile.photo": z.string().optional().or(z.literal("")),
  "profile.bio": z.string().optional().or(z.literal("")),
});

/* ── Contact form ─────────────────────────────────────────────────────────── */
export const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  subject: z.string().max(140).optional().or(z.literal("")),
  body: z.string().min(10, "Pesan minimal 10 karakter"),
  // honeypot: must stay empty (bot trap)
  company: z.string().max(0).optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type SongInput = z.infer<typeof songSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
