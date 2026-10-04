"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Instagram,
  Loader2,
  Lock,
  Mail,
  Send,
  Send as TelegramIcon,
  Music2,
} from "lucide-react";
import { sendContactMessage, type ContactActionState } from "@/lib/actions/contact";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { SITE, SOCIAL_KEYS } from "@/lib/constants";
import { isHttpUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

const SOCIAL_ICON: Record<string, React.ElementType> = {
  "social.instagram": Instagram,
  "social.tiktok": Music2,
  "social.telegram": TelegramIcon,
  "social.github": Github,
};

const initialContact: ContactActionState = { ok: false, message: "" };
const initialLogin: LoginState = { ok: false, message: "" };

/* ── Secret admin login modal ────────────────────────────────────────────── */
function SecretLoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formAction] = useFormState(loginAction, initialLogin);
  const [pending, setPending] = React.useState(false);

  const action = async (formData: FormData) => {
    setPending(true);
    try {
      await formAction(formData);
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} label="Secret admin login" className="max-w-md">
    <div className="relative overflow-hidden p-8">

      <div className="relative flex flex-col items-center gap-3 text-center">
        <span className="grid size-12 place-items-center rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface2))]">
          <Lock className="size-5 text-[rgb(var(--ink))]" />
        </span>
          <div>
            <h3 className="editorial-title text-2xl font-light">Secret Access</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Halaman ini tidak terdaftar di navigasi publik.
            </p>
          </div>
        </div>

        <form action={action} className="relative mt-7 space-y-4">
          <Field label="Email">
            <Input name="email" type="email" placeholder="admin@clevonext.dev" required autoComplete="email" />
          </Field>
          <Field label="Password">
            <Input name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
          </Field>

          {state.message ? (
            <p
              className={
                state.ok ? "text-xs text-emerald-400" : "text-xs text-destructive"
              }
            >
              {state.message}
            </p>
          ) : null}

          <Button type="submit" variant="accent" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            Masuk ke Dashboard
          </Button>

          <p className="text-center text-[0.68rem] text-muted-foreground">
            Terverifikasi melalui database Vercel Postgres.
          </p>
        </form>
      </div>
    </Modal>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
export function Footer({ settings }: { settings: Record<string, string> }) {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [state, formAction] = useFormState(sendContactMessage, initialContact);
  const [pending, setPending] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const clickTimes = React.useRef<number[]>([]);

  const email = settings["site.email"] || SITE.email;

  const action = async (formData: FormData) => {
    setPending(true);
    try {
      await formAction(formData);
    } finally {
      setPending(false);
    }
  };

  // Reset the form once the message is delivered.
  React.useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  /**
   * TRIPLE-CLICK SECRET FEATURE
   * Three clicks on the copyright line within 800 ms unlock the admin modal.
   */
  const handleSecretClick = React.useCallback(() => {
    const now = Date.now();
    clickTimes.current = [...clickTimes.current, now].filter((time) => now - time < 800);

    if (clickTimes.current.length >= 3) {
      clickTimes.current = [];
      setLoginOpen(true);
    }
  }, []);

  return (
    <footer id="contact" className="relative scroll-mt-24 pt-20">
        <div className="relative overflow-hidden rounded-3xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-7 sm:p-10">
        <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: contact info */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <span className="eyebrow">05 — Contact</span>
              <h2 className="editorial-title mt-3 text-4xl font-light sm:text-5xl">
                Mari <span className="italic text-[rgb(var(--ink))]">berkolaborasi</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Punya proyek, kolaborasi, atau sekadar ingin menyapa? Kirim pesan
                langsung ke Gmail saya — biasanya saya membalas dalam 1×24 jam.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href={`mailto:${email}`}
                className="group inline-flex items-center gap-3 text-sm text-[rgb(var(--ink-dim))] transition-colors hover:text-[rgb(var(--ink))]"
              >
                <span className="grid size-10 place-items-center rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface2))]">
                  <Mail className="size-4" />
                </span>
                {email}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              <div className="hairline pt-6">
                <p className="eyebrow mb-3">Social</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_KEYS.map(({ key, label }) => {
                    const url = settings[key];
                    const Icon = SOCIAL_ICON[key] ?? ArrowUpRight;
                    const disabled = !isHttpUrl(url);
                    return disabled ? (
                      <span
                        key={key}
                        aria-disabled
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-[#2E2E2E] px-4 py-2 text-xs text-[rgb(var(--ink-mute))]/50"
                      >
                        <Icon className="size-3.5" />
                        {label}
                      </span>
                    ) : (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--line))] bg-[rgb(var(--surface2))] px-4 py-2 text-xs text-[rgb(var(--ink-dim))] transition-colors hover:border-[rgb(var(--line-strong))] hover:text-[rgb(var(--ink))]"
                      >
                        <Icon className="size-3.5" />
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <form ref={formRef} action={action} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama">
                <Input name="name" placeholder="Nama lengkap" required minLength={2} />
              </Field>
              <Field label="Email">
                <Input name="email" type="email" placeholder="nama@email.com" required />
              </Field>
            </div>

            <Field label="Subjek" hint="opsional">
              <Input name="subject" placeholder="Kolaborasi proyek" />
            </Field>

            <Field label="Pesan">
              <Textarea name="body" placeholder="Tulis pesan Anda…" required minLength={10} />
            </Field>

            {/* Honeypot (hidden from humans) */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" variant="accent" disabled={pending}>
                {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                Kirim Pesan
              </Button>

              {state.message ? (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    state.ok ? "text-xs text-emerald-400" : "text-xs text-destructive"
                  }
                >
                  {state.message}
                </motion.p>
              ) : null}
            </div>
          </form>
        </div>

        {/* Copyright + secret trigger */}
        <div className="relative mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgb(var(--line))] pt-7 sm:flex-row">
          <button
            type="button"
            onClick={handleSecretClick}
            title="© Clevonext.Dev"
            aria-label="Copyright"
            className="cursor-default select-none text-[0.7rem] text-muted-foreground/60 transition-colors duration-500 hover:text-muted-foreground active:scale-[0.99]"
          >
            © {new Date().getFullYear()} {SITE.brand} — All rights reserved.
          </button>

          <div className="flex items-center gap-4 text-[0.7rem] text-muted-foreground/60">
            <span>{SITE.owner}</span>
            <span className="hidden sm:inline">·</span>
            <Link href="/admin" className="transition-colors hover:text-[rgb(var(--ink))]">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <SecretLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </footer>
  );
}