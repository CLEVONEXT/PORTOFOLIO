import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-5 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="aurora-bg animate-aurora" />
        <div className="absolute inset-0 grid-lines opacity-25" />
      </div>

      <div className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-ember/15 blur-3xl" />

        <div className="relative flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-2xl border border-white/12 bg-white/[0.06]">
            <Lock className="size-5 text-ember" />
          </span>
          <div>
            <span className="eyebrow text-[0.58rem]">Restricted Area</span>
            <h1 className="editorial-title mt-2 text-2xl font-light">
              Clevonext<span className="text-ember">.Dev</span> Admin
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Masuk dengan kredensial yang terdaftar di database.
            </p>
          </div>
        </div>

        <LoginForm />

        <Link
          href="/"
          className="relative mt-6 flex items-center justify-center gap-2 text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke portofolio
        </Link>
      </div>
    </main>
  );
}