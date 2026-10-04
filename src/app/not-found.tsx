import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-bg animate-aurora" />
        <div className="absolute inset-0 grid-lines opacity-25" />
      </div>

      <div className="relative">
        <p className="eyebrow">Error 404</p>
        <h1 className="editorial-title mt-4 text-6xl font-light sm:text-8xl">
          Not <span className="italic text-ember">Found</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Halaman yang Anda cari tidak tersedia.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-medium text-ink-950 transition-transform hover:scale-[1.03]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}