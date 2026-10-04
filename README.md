# 🎨 Clevonext.Dev — Personal Portfolio Platform

Portofolio personal **Moh. Arsyil Afif Mdani** (Software Engineering) — dibangun sekali, jalan di tiga tempat: **Web**, **Desktop (Electron)**, dan **Mobile-ready PWA / Capacitor**.

- **Landing page**: editorial · minimalist · elegant · dark mode
- **Admin panel**: full-screen enterprise dashboard dengan **glassmorphism murni**

---

## 1. Struktur Folder

```
PORTOFOLIO DESIGN MODERN/
├─ electron/                     # Desktop wrapper (Electron)
│  ├─ main.js                    # Window + bundled Next standalone server
│  └─ preload.js                 # Safe contextBridge
├─ prisma/
│  ├─ schema.prisma              # Skema database (Vercel Postgres)
│  ├─ seed.ts                    # Admin user + demo content
│  └─ sql/bootstrap.sql          # Raw SQL alternatif (Prisma-equivalent)
├─ public/
│  ├─ manifest.webmanifest       # PWA manifest
│  ├─ sw.js                      # Service worker (offline shell)
│  ├─ icons/                     # PWA / Electron icons
│  └─ uploads/                   # Local upload fallback (dev)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx              # Root layout, fonts, metadata, Toaster
│  │  ├─ page.tsx                # Landing page (server component)
│  │  ├─ globals.css             # Design tokens + glassmorphism utilities
│  │  ├─ not-found.tsx
│  │  ├─ admin/
│  │  │  ├─ page.tsx             # Protected full-screen dashboard
│  │  │  └─ login/page.tsx       # Secret login page
│  │  └─ api/
│  │     ├─ auth/[...nextauth]/  # Auth.js handlers
│  │     ├─ upload/              # Universal file upload
│  │     └─ spotify/search/      # Spotify catalogue search
│  ├─ components/
│  │  ├─ layout/                 # SplashScreen · LeftNavbar · Footer
│  │  ├─ sections/               # Hero · About · Projects · Skills · Certificates · MusicPlayer
│  │  ├─ admin/                  # AdminDashboard + per-section CRUD modules
│  │  ├─ pwa/                    # Service worker registrar
│  │  └─ ui/                     # Shadcn-style primitives
│  ├─ lib/
│  │  ├─ actions/                # Server actions (admin, auth, contact)
│  │  ├─ validations/            # Zod schemas
│  │  ├─ auth.ts / auth.config.ts
│  │  ├─ prisma.ts · data.ts · storage.ts · email.ts
│  │  ├─ constants.ts · utils.ts
│  ├─ middleware.ts              # Protects /admin/*
│  └─ types/next-auth.d.ts
├─ capacitor.config.json         # Mobile wrapper
├─ tailwind.config.ts            # Tokens, animations, glass shadows
├─ next.config.js
└─ .env.example
```

---

## 2. Setup Cepat

```powershell
# 1. Install dependency
npm install

# 2. Siapkan environment
Copy-Item .env.example .env
#    → isi DATABASE_URL, AUTH_SECRET, RESEND_API_KEY, dll.

# 3. Buat tabel + isi data awal (admin + demo konten)
npm run db:push
npm run db:seed

# 4. Jalankan
npm run dev
```

Buka `http://localhost:3000`.

**Login admin** (dari `db:seed`, ubah via env `SEED_ADMIN_*`):

```
Email:    admin@clevonext.dev
Password: Clevonext#2026
```

---

## 3. Skema Database

| Tabel                             | Fungsi                                                             |
| --------------------------------- | ------------------------------------------------------------------ |
| `users` / `accounts` / `sessions` | Auth.js + admin credentials (bcrypt)                               |
| `projects`                        | CRUD daftar karya, tech stack, demo/repo                           |
| `certificates`                    | Sertifikat — upload file **atau** link eksternal + thumbnail wajib |
| `experiences`                     | Timeline pendidikan, kuliah, organisasi, pekerjaan                 |
| `skills`                          | Keahlian per kategori (Frontend/Backend/Tools/Cloud/Design)        |
| `songs`                           | Playlist favorit (audio file atau Spotify embed) + urutan          |
| `settings`                        | Key-value: brand, owner, sosmed, foto profil, bio                  |
| `messages`                        | Pesan dari contact form footer                                     |

Terapkan dengan `prisma db push`, `prisma migrate dev`, **atau** jalankan `prisma/sql/bootstrap.sql` langsung di SQL editor Vercel/Supabase.

---

## 4. Fitur Utama

### Landing Page

- **SplashScreen** — typography reveal "Clevonext.dev" + curtain lift (Framer Motion)
- **LeftNavbar** — vertical nav desktop / drawer mobile, active-section tracking, scroll progress rail
- **AboutSection** — interactive 3D photo card (Nama + Jurusan), timeline experience dinamis, **MusicPlayer dengan Search Bar** (5+ lagu favorit)
- **Projects / Skills / Certificates** — semua dinamis dari database, dengan modal preview
- **Footer** — contact form (Resend) + sosial media dinamis + **TRIPLE-CLICK pada teks copyright** membuka modal Secret Admin Login

### Admin Panel (Glassmorphism Full-Screen)

- Sidebar glass + topbar sticky + aurora backdrop, transisi antar-section beranimasi
- **Projects**: CRUD lengkap
- **Certificates**: upload serba bisa → drag & drop, file explorer, atau URL eksternal (thumbnail/logo penerbit **wajib** agar visual konsisten)
- **Experience**: CRUD timeline (sekolah/kuliah/organisasi/kerja)
- **Skills**: CRUD dengan slider level
- **Playlist**: **search bar admin** (filter database + Spotify API search), CRUD, atur urutan ↑↓
- **Social & Profile**: ubah identitas, bio, foto, dan 4 tautan sosmed
- **Messages**: inbox pesan contact form, tandai dibaca, balas via email

---

## 5. Menjalankan di Desktop (Electron)

```powershell
# Development (Next + Electron bersamaan)
npm run electron:dev

# Build installer
$env:BUILD_TARGET="desktop"; npm run build
npm run electron:build
```

Installer tersimpan di `electron-dist/`.

---

## 6. Mobile (PWA / Capacitor)

**PWA** sudah aktif otomatis (manifest + service worker, registrasi hanya di production).

Untuk native build:

```powershell
npm i -D @capacitor/cli @capacitor/core
npx cap add android      # dan/atau: npx cap add ios
npm run cap:android
```

Sesuaikan `server.url` di `capacitor.config.json` ke domain produksi Anda.

---

## 7. Environment Variables

Lihat `.env.example`. Yang paling penting:

| Variable                                      | Kegunaan                                            |
| --------------------------------------------- | --------------------------------------------------- |
| `DATABASE_URL` / `DIRECT_URL`                 | Vercel Postgres / Supabase                          |
| `AUTH_SECRET`                                 | Session signing (`openssl rand -base64 32`)         |
| `BLOB_READ_WRITE_TOKEN`                       | Vercel Blob (kosongkan → fallback `public/uploads`) |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL`         | Contact form ke Gmail                               |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | Pencarian lagu di admin panel                       |

---

## 8. Scripts

| Script                            | Fungsi                             |
| --------------------------------- | ---------------------------------- |
| `npm run dev`                     | Next.js dev server                 |
| `npm run build`                   | Prisma generate + production build |
| `npm run db:push`                 | Sinkronkan schema ke database      |
| `npm run db:seed`                 | Seed admin + demo content          |
| `npm run db:studio`               | Prisma Studio                      |
| `npm run electron:dev`            | Next + Electron (dev)              |
| `npm run electron:build`          | Package installer desktop          |
| `npm run cap:android` / `cap:ios` | Sync + buka project native         |

---

## 9. Catatan Keamanan

- Password admin di-hash dengan **bcrypt** (cost 12).
- Route `/admin/*` diproteksi `middleware.ts` (Edge) + validasi ulang di setiap server action.
- Contact form dilengkapi **honeypot** anti-bot.
- Upload dibatasi 8 MB dan whitelist MIME (image + PDF).

---

© 2026 **Clevonext.Dev** — Moh. Arsyil Afif Mdani. All rights reserved.
