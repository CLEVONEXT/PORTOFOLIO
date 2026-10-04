/**
 * Clevonext.Dev — database seed
 * Creates the admin user + demo portfolio content.
 *
 * Usage:  npm run db:seed
 */
import {
  PrismaClient,
  ExperienceType,
  SkillCategory,
  ProjectStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SETTINGS: Record<string, string> = {
  "site.brand": "Clevonext.Dev",
  "site.owner": "Moh. Arsyil Afif Mdani",
  "site.major": "Software Engineering",
  "site.tagline": "Editorial portfolio of a software engineering student.",
  "site.email": "hello@clevonext.dev",
  "social.instagram": "https://instagram.com/",
  "social.tiktok": "https://tiktok.com/",
  "social.telegram": "https://t.me/",
  "social.github": "https://github.com/",
  "profile.photo": "/images/profile/arsyil.jpg",
  "profile.bio":
    "Saya Moh. Arsyil Afif Mdani, siswa jurusan Software Engineering yang berfokus pada pengembangan web modern. Saya menikmati merancang antarmuka yang bersih, cepat, dan bermakna — dari riset pengguna sampai deploy ke production.",
};

async function main() {
  console.log("→ Seeding settings…");
  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log("→ Seeding admin user…");
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@clevonext.dev";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Clevonext#2026";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      name: "Moh. Arsyil Afif Mdani",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`   admin: ${email} / ${password}`);

  console.log("→ Seeding experiences…");
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        title: "Software Engineering",
        organization: "SMK / Vocational High School",
        type: ExperienceType.EDUCATION,
        location: "Indonesia",
        description:
          "Menempuh pendidikan kejuruan dengan fokus rekayasa perangkat lunak: pemrograman, basis data, dan rekayasa web.",
        startDate: new Date("2022-07-01"),
        isCurrent: true,
        sortOrder: 0,
      },
      {
        title: "Web Development Intern",
        organization: "Digital Studio",
        type: ExperienceType.WORK,
        location: "Remote",
        description:
          "Membangun landing page dan dashboard internal menggunakan Next.js, Tailwind, dan REST API.",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-09-01"),
        sortOrder: 1,
      },
      {
        title: "Media & Technology Division",
        organization: "Student Organization",
        type: ExperienceType.ORGANIZATION,
        description:
          "Mengelola dokumentasi digital dan website kegiatan organisasi sekolah.",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-12-01"),
        sortOrder: 2,
      },
    ],
  });

  console.log("→ Seeding projects…");
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        slug: "clevonext-portfolio",
        title: "Clevonext.Dev — Editorial Portfolio",
        summary:
          "Portofolio personal bertema editorial dengan dark mode, splash animation, dan admin dashboard glassmorphism.",
        description:
          "Dibangun dengan Next.js App Router, Prisma, Auth.js, Tailwind, dan Framer Motion. Mendukung web, desktop (Electron), dan PWA.",
        coverImage: "/images/projects/portfolio.jpg",
        techStack: [
          "Next.js",
          "TypeScript",
          "Prisma",
          "Tailwind",
          "Framer Motion",
        ],
        demoUrl: "https://clevonext.dev",
        repoUrl: "https://github.com/clevonext",
        category: "Web App",
        year: 2026,
        featured: true,
        status: ProjectStatus.PUBLISHED,
        sortOrder: 0,
      },
      {
        slug: "smart-attendance",
        title: "Smart Attendance System",
        summary:
          "Sistem absensi berbasis QR dengan dashboard realtime dan laporan otomatis.",
        techStack: ["React", "Node.js", "PostgreSQL"],
        category: "Full Stack",
        year: 2025,
        featured: true,
        status: ProjectStatus.PUBLISHED,
        sortOrder: 1,
      },
    ],
  });

  console.log("→ Seeding skills…");
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      {
        name: "TypeScript",
        category: SkillCategory.FRONTEND,
        level: 88,
        sortOrder: 0,
      },
      {
        name: "React / Next.js",
        category: SkillCategory.FRONTEND,
        level: 90,
        sortOrder: 1,
      },
      {
        name: "Tailwind CSS",
        category: SkillCategory.FRONTEND,
        level: 92,
        sortOrder: 2,
      },
      {
        name: "Node.js",
        category: SkillCategory.BACKEND,
        level: 82,
        sortOrder: 3,
      },
      {
        name: "PostgreSQL",
        category: SkillCategory.BACKEND,
        level: 78,
        sortOrder: 4,
      },
      {
        name: "Prisma",
        category: SkillCategory.BACKEND,
        level: 80,
        sortOrder: 5,
      },
      {
        name: "Git & GitHub",
        category: SkillCategory.TOOLS,
        level: 85,
        sortOrder: 6,
      },
      {
        name: "Figma",
        category: SkillCategory.DESIGN,
        level: 75,
        sortOrder: 7,
      },
      {
        name: "Vercel",
        category: SkillCategory.CLOUD,
        level: 84,
        sortOrder: 8,
      },
    ],
  });

  console.log("→ Seeding songs (5 favorites)…");
  await prisma.song.deleteMany();
  await prisma.song.createMany({
    data: [
      {
        title: "Perfect",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        mood: "Calm",
        spotifyUrl: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
        spotifyEmbed:
          "https://open.spotify.com/embed/track/0tgVpDi06FyKpA1z0VMD4v",
        sortOrder: 0,
      },
      {
        title: "Yellow",
        artist: "Coldplay",
        album: "Parachutes",
        mood: "Nostalgic",
        spotifyUrl: "https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg",
        spotifyEmbed:
          "https://open.spotify.com/embed/track/3AJwUDP919kvQ9QcozQPxg",
        sortOrder: 1,
      },
      {
        title: "Sial",
        artist: "Mahalini",
        mood: "Melancholy",
        spotifyUrl: "https://open.spotify.com/track/4Y5h6hTVq7SMpKv1CRnpXG",
        spotifyEmbed:
          "https://open.spotify.com/embed/track/4Y5h6hTVq7SMpKv1CRnpXG",
        sortOrder: 2,
      },
      {
        title: "Lofi Study Beats",
        artist: "Various Artists",
        mood: "Focus",
        spotifyUrl: "https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM",
        spotifyEmbed:
          "https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM",
        sortOrder: 3,
      },
      {
        title: "Runtuh",
        artist: "Feby Putri & Fiersa Besari",
        mood: "Reflective",
        spotifyUrl: "https://open.spotify.com/track/4A8Z1hMHIkRGN44mXeH7nh",
        spotifyEmbed:
          "https://open.spotify.com/embed/track/4A8Z1hMHIkRGN44mXeH7nh",
        sortOrder: 4,
      },
    ],
  });

  console.log("→ Seeding certificates…");
  await prisma.certificate.deleteMany();
  await prisma.certificate.createMany({
    data: [
      {
        title: "Frontend Web Development Fundamentals",
        issuer: "Dicoding",
        issuedAt: new Date("2024-05-01"),
        source: "EXTERNAL_URL",
        verifyUrl: "https://www.dicoding.com/certificates/",
        thumbnailUrl: "/images/certificates/dicoding-logo.png",
        issuerLogo: "/images/certificates/dicoding-logo.png",
        skills: ["HTML", "CSS", "JavaScript"],
        featured: true,
        sortOrder: 0,
      },
      {
        title: "Responsive Web Design",
        issuer: "freeCodeCamp",
        issuedAt: new Date("2024-02-01"),
        source: "EXTERNAL_URL",
        verifyUrl: "https://freecodecamp.org/certification/",
        thumbnailUrl: "/images/certificates/fcc-logo.png",
        issuerLogo: "/images/certificates/fcc-logo.png",
        skills: ["Responsive Design", "Flexbox", "Grid"],
        sortOrder: 1,
      },
    ],
  });

  console.log("✓ Seed selesai.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
