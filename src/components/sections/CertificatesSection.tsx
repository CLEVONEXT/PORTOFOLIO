"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Award, BadgeCheck, ExternalLink, ImageIcon } from "lucide-react";
import { formatMonthYear } from "@/lib/utils";
import { Badge } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";

export type CertificateView = {
  id: string;
  title: string;
  issuer: string;
  issuedAt?: Date | string | null;
  credentialId?: string | null;
  verifyUrl?: string | null;
  source: string;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  issuerLogo?: string | null;
  skills: string[];
};

export function CertificatesSection({ certificates }: { certificates: CertificateView[] }) {
  const [selected, setSelected] = React.useState<CertificateView | null>(null);
  // Always render so the navbar anchor (id="certificates") always exists.
  const empty = certificates.length === 0;

  return (
    <section id="certificates" className="relative scroll-mt-24 py-20 sm:py-28">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">04 — Certificates</span>
          <h2 className="editorial-title mt-3 text-4xl font-light sm:text-5xl">
            Sertifikat & <span className="italic text-[rgb(var(--ink))]">Pencapaian</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Validasi keahlian melalui program sertifikasi resmi. Klik kartu untuk
          melihat pratinjau.
        </p>
      </header>

      {empty ? (
        <div className="mt-12 grid place-items-center rounded-3xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-14 text-center">
          <div>
            <p className="text-sm text-[rgb(var(--ink-dim))]">Belum ada sertifikat yang ditampilkan.</p>
            <p className="mt-1 text-xs text-[rgb(var(--ink-mute))]">
              Sertifikat akan muncul di sini setelah ditambahkan lewat dashboard admin.
            </p>
          </div>
        </div>
      ) : (
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate, index) => {
          const preview = certificate.thumbnailUrl || certificate.fileUrl;
          return (
            <motion.button
              key={certificate.id}
              type="button"
              onClick={() => setSelected(certificate)}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-5 text-left transition-colors duration-300 hover:border-[rgb(var(--line-strong))]"
            >
              <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface2))]">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt={certificate.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid size-full place-items-center">
                    <Award className="size-7 text-muted-foreground/40" />
                  </div>
                )}

                <div className="absolute right-3 top-3">
                  <Badge tone={certificate.source === "EXTERNAL_URL" ? "glow" : "muted"}>
                    {certificate.source === "EXTERNAL_URL" ? "Link" : "Upload"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {certificate.issuerLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={certificate.issuerLogo}
                    alt={certificate.issuer}
                    className="size-5 rounded object-contain"
                    loading="lazy"
                  />
                ) : (
                  <BadgeCheck className="size-4 text-[rgb(var(--ink))]" />
                )}
                <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {certificate.issuer}
                </span>
              </div>

              <h3 className="mt-2 text-base font-medium leading-snug tracking-tight transition-colors group-hover:text-[rgb(var(--ink))]">
                {certificate.title}
              </h3>

              <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground">
                {formatMonthYear(certificate.issuedAt)}
              </p>
            </motion.button>
          );
        })}
      </div>
      )}

      {/* Preview modal */}
      <Modal
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
        label={selected?.title}
        className="max-w-3xl"
      >
        {selected ? (
          <div className="p-6 sm:p-8">
            <div className="overflow-hidden rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface2))]">
              {selected.fileUrl || selected.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.fileUrl || selected.thumbnailUrl || ""}
                  alt={selected.title}
                  className="max-h-[52vh] w-full object-contain"
                />
              ) : (
                <div className="grid h-56 place-items-center">
                  <ImageIcon className="size-8 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {selected.issuerLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.issuerLogo}
                  alt={selected.issuer}
                  className="size-6 rounded object-contain"
                />
              ) : null}
              <Badge tone="accent">{selected.issuer}</Badge>
              <span className="font-mono text-[0.7rem] text-muted-foreground">
                {formatMonthYear(selected.issuedAt)}
              </span>
            </div>

            <h3 className="editorial-title mt-3 text-2xl font-light">{selected.title}</h3>

            {selected.credentialId ? (
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                ID: {selected.credentialId}
              </p>
            ) : null}

            {selected.skills.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selected.skills.map((skill) => (
                  <Badge key={skill} tone="muted">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : null}

            {selected.verifyUrl ? (
              <a
                href={selected.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-medium text-background transition-transform hover:scale-[1.03]"
              >
                Verifikasi Kredensial
                <ExternalLink className="size-3.5" />
              </a>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </section>
  );
}