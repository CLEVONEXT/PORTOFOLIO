import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import { authSecret } from "@/lib/auth.config";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = authSecret ? await auth() : null;
  if (session?.user) redirect("/admin");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[rgb(var(--bg))] px-5 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-lines opacity-25" />
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-8 sm:p-10">

        <div className="relative flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface2))]">
            <Lock className="size-5 text-[rgb(var(--ink))]" />
          </span>
          <div>
            <span className="eyebrow text-[0.58rem]">Restricted Area</span>
            <h1 className="editorial-title mt-2 text-2xl font-light">
              Clevonext<span className="text-[rgb(var(--ink-mute))]">.Dev</span> Admin
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Masuk dengan kredensial yang terdaftar di database.
            </p>
          </div>
        </div>

        {authSecret ? (
          <LoginForm />
        ) : (
          <p role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
            Login admin sementara tidak tersedia. Atur NEXTAUTH_SECRET atau AUTH_SECRET di environment deployment.
          </p>
        )}

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