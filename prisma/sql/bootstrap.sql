-- ============================================================================
-- Clevonext.Dev — Vercel Postgres bootstrap (raw SQL, Prisma-equivalent)
-- Run in the Vercel Postgres / Supabase SQL editor if you prefer SQL over
-- `prisma db push`. Enum names are prefixed `clevo_` to avoid collisions.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Enums ───────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "clevo_role" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "clevo_project_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "clevo_certificate_source" AS ENUM ('UPLOAD', 'EXTERNAL_URL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "clevo_experience_type" AS ENUM
    ('EDUCATION', 'COLLEGE', 'ORGANIZATION', 'WORK', 'ACHIEVEMENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "clevo_skill_category" AS ENUM
    ('FRONTEND', 'BACKEND', 'TOOLS', 'CLOUD', 'DESIGN', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Auth ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "users" (
  "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"          TEXT,
  "email"         TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP(3),
  "image"         TEXT,
  "passwordHash"  TEXT,
  "role"          "clevo_role" NOT NULL DEFAULT 'ADMIN',
  "lastLoginAt"   TIMESTAMP(3),
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "id"                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"            TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId"       TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires"      TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token"      TEXT NOT NULL UNIQUE,
  "expires"    TIMESTAMP(3) NOT NULL,
  UNIQUE ("identifier", "token")
);

-- ── Content ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "projects" (
  "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "slug"        TEXT NOT NULL UNIQUE,
  "title"       TEXT NOT NULL,
  "summary"     TEXT,
  "description" TEXT,
  "coverImage"  TEXT,
  "gallery"     TEXT[] NOT NULL DEFAULT '{}',
  "techStack"   TEXT[] NOT NULL DEFAULT '{}',
  "demoUrl"     TEXT,
  "repoUrl"     TEXT,
  "category"    TEXT,
  "year"        INTEGER,
  "featured"    BOOLEAN NOT NULL DEFAULT FALSE,
  "status"      "clevo_project_status" NOT NULL DEFAULT 'PUBLISHED',
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "projects_status_sortOrder_idx"
  ON "projects" ("status", "sortOrder");

CREATE TABLE IF NOT EXISTS "certificates" (
  "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title"        TEXT NOT NULL,
  "issuer"       TEXT NOT NULL,
  "issuedAt"     TIMESTAMP(3),
  "expiresAt"    TIMESTAMP(3),
  "credentialId" TEXT,
  "verifyUrl"    TEXT,
  "source"       "clevo_certificate_source" NOT NULL DEFAULT 'UPLOAD',
  "fileUrl"      TEXT,
  "thumbnailUrl" TEXT,
  "issuerLogo"   TEXT,
  "skills"       TEXT[] NOT NULL DEFAULT '{}',
  "featured"     BOOLEAN NOT NULL DEFAULT FALSE,
  "sortOrder"    INTEGER NOT NULL DEFAULT 0,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "certificates_sortOrder_idx" ON "certificates" ("sortOrder");

CREATE TABLE IF NOT EXISTS "experiences" (
  "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title"        TEXT NOT NULL,
  "organization" TEXT NOT NULL,
  "type"         "clevo_experience_type" NOT NULL DEFAULT 'EDUCATION',
  "location"     TEXT,
  "description"  TEXT,
  "startDate"    TIMESTAMP(3) NOT NULL,
  "endDate"      TIMESTAMP(3),
  "isCurrent"    BOOLEAN NOT NULL DEFAULT FALSE,
  "logoUrl"      TEXT,
  "tags"         TEXT[] NOT NULL DEFAULT '{}',
  "sortOrder"    INTEGER NOT NULL DEFAULT 0,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "experiences_type_sortOrder_idx"
  ON "experiences" ("type", "sortOrder");

CREATE TABLE IF NOT EXISTS "skills" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"      TEXT NOT NULL,
  "category"  "clevo_skill_category" NOT NULL DEFAULT 'FRONTEND',
  "level"     INTEGER NOT NULL DEFAULT 70,
  "iconUrl"   TEXT,
  "colorHex"  TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "skills_category_sortOrder_idx"
  ON "skills" ("category", "sortOrder");

CREATE TABLE IF NOT EXISTS "songs" (
  "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title"        TEXT NOT NULL,
  "artist"       TEXT NOT NULL,
  "album"        TEXT,
  "coverArt"     TEXT,
  "audioUrl"     TEXT,
  "spotifyUrl"   TEXT,
  "spotifyEmbed" TEXT,
  "durationSec"  INTEGER,
  "mood"         TEXT,
  "isFavorite"   BOOLEAN NOT NULL DEFAULT TRUE,
  "sortOrder"    INTEGER NOT NULL DEFAULT 0,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "songs_sortOrder_idx" ON "songs" ("sortOrder");

CREATE TABLE IF NOT EXISTS "messages" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"      TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "subject"   TEXT,
  "body"      TEXT NOT NULL,
  "read"      BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "settings" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "key"       TEXT NOT NULL UNIQUE,
  "value"     TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Seed: default settings ──────────────────────────────────────────────────
INSERT INTO "settings" ("key", "value") VALUES
  ('site.brand',            'Clevonext.Dev'),
  ('site.owner',            'Moh. Arsyil Afif Mdani'),
  ('site.major',            'Software Engineering'),
  ('site.email',            'hello@clevonext.dev'),
  ('social.instagram',      'https://instagram.com/'),
  ('social.tiktok',         'https://tiktok.com/'),
  ('social.telegram',       'https://t.me/'),
  ('social.github',         'https://github.com/'),
  ('profile.photo',         '/images/profile/arsyil.jpg'),
  ('profile.bio',           'Software Engineering student building clean, human-centered digital products.')
ON CONFLICT ("key") DO NOTHING;