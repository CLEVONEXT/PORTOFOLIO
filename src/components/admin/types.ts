import type { ADMIN_SECTIONS } from "@/lib/constants";

export type ActionResult = { ok: boolean; message: string; id?: string };
export type SectionId = (typeof ADMIN_SECTIONS)[number]["id"];

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  coverImage: string | null;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  category: string | null;
  year: number | null;
  featured: boolean;
  status: string;
  sortOrder: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string | Date | null;
  credentialId: string | null;
  verifyUrl: string | null;
  source: string;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  issuerLogo: string | null;
  skills: string[];
  featured: boolean;
  sortOrder: number;
};

export type Experience = {
  id: string;
  title: string;
  organization: string;
  type: string;
  location: string | null;
  description: string | null;
  startDate: string | Date;
  endDate: string | Date | null;
  isCurrent: boolean;
  logoUrl: string | null;
  tags: string[];
  sortOrder: number;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  colorHex: string | null;
  sortOrder: number;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  coverArt: string | null;
  audioUrl: string | null;
  spotifyUrl: string | null;
  spotifyEmbed: string | null;
  durationSec: number | null;
  mood: string | null;
  isFavorite: boolean;
  sortOrder: number;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  read: boolean;
  createdAt: string | Date;
};

export type Settings = Record<string, string>;

export type AdminActions = {
  saveProject: (data: unknown) => Promise<ActionResult>;
  deleteProject: (id: string) => Promise<ActionResult>;
  saveCertificate: (data: unknown) => Promise<ActionResult>;
  deleteCertificate: (id: string) => Promise<ActionResult>;
  saveExperience: (data: unknown) => Promise<ActionResult>;
  deleteExperience: (id: string) => Promise<ActionResult>;
  saveSkill: (data: unknown) => Promise<ActionResult>;
  deleteSkill: (id: string) => Promise<ActionResult>;
  saveSong: (data: unknown) => Promise<ActionResult>;
  deleteSong: (id: string) => Promise<ActionResult>;
  reorderSongs: (ids: string[]) => Promise<ActionResult>;
  markMessageRead: (id: string, read?: boolean) => Promise<ActionResult>;
  deleteMessage: (id: string) => Promise<ActionResult>;
};

export type AdminDashboardProps = {
  user: { name?: string | null; email?: string | null };
  settings: Settings;
  projects: Project[];
  certificates: Certificate[];
  experiences: Experience[];
  skills: Skill[];
  songs: Song[];
  messages: Message[];
  actions: AdminActions;
};
