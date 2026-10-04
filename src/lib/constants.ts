export const SITE = {
  brand: "Clevonext.Dev",
  owner: "Moh. Arsyil Afif Mdani",
  major: "Software Engineering",
  tagline: "Editorial portfolio of a software engineering student.",
  email: "hello@clevonext.dev",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const NAV_ITEMS = [
  { id: "home", label: "Home", hint: "Beranda" },
  { id: "about", label: "About", hint: "Tentang saya" },
  { id: "projects", label: "Projects", hint: "Daftar karya" },
  { id: "skills", label: "Skills", hint: "Keahlian" },
  { id: "certificates", label: "Certificates", hint: "Sertifikat" },
  { id: "contact", label: "Contact", hint: "Hubungi saya" },
] as const;

export type NavItemId = (typeof NAV_ITEMS)[number]["id"];

export const SOCIAL_KEYS = [
  { key: "social.instagram", label: "Instagram" },
  { key: "social.tiktok", label: "TikTok" },
  { key: "social.telegram", label: "Telegram" },
  { key: "social.github", label: "GitHub" },
] as const;

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  TOOLS: "Tools",
  CLOUD: "Cloud",
  DESIGN: "Design",
  OTHER: "Other",
};

export const EXPERIENCE_TYPE_LABELS: Record<string, string> = {
  EDUCATION: "Pendidikan",
  COLLEGE: "Kuliah",
  ORGANIZATION: "Organisasi",
  WORK: "Pekerjaan",
  ACHIEVEMENT: "Pencapaian",
};

export const ADMIN_SECTIONS = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard" },
  { id: "projects", label: "Projects", icon: "FolderKanban" },
  { id: "certificates", label: "Certificates", icon: "Award" },
  { id: "experiences", label: "Experience", icon: "Route" },
  { id: "skills", label: "Skills", icon: "Cpu" },
  { id: "playlist", label: "Playlist", icon: "Music4" },
  { id: "social", label: "Social & Profile", icon: "Share2" },
  { id: "messages", label: "Messages", icon: "Inbox" },
] as const;

export type AdminSectionId = (typeof ADMIN_SECTIONS)[number]["id"];
