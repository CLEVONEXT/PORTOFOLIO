"use client";

import * as React from "react";
import { Award, Link2, Loader2, Plus, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { cn, formatMonthYear } from "@/lib/utils";
import { Badge, Field, Switch } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { EmptyState, Panel, PanelHeader, RowActions } from "@/components/admin/primitives";
import type { AdminActions, Certificate } from "@/components/admin/types";

const EMPTY = {
  id: "",
  title: "",
  issuer: "",
  issuedAt: "",
  expiresAt: "",
  credentialId: "",
  verifyUrl: "",
  source: "UPLOAD",
  fileUrl: "",
  thumbnailUrl: "",
  issuerLogo: "",
  skills: "",
  featured: false,
  sortOrder: 0,
};

const toDateInput = (value: string | Date | null | undefined) =>
  value ? String(value).slice(0, 10) : "";

export function CertificatesAdminSection({
  certificates,
  actions,
}: {
  certificates: Certificate[];
  actions: AdminActions;
}) {
  const [form, setForm] = React.useState({ ...EMPTY });
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const startCreate = () => {
    setForm({ ...EMPTY, sortOrder: certificates.length });
    setOpen(true);
  };

  const startEdit = (certificate: Certificate) => {
    setForm({
      id: certificate.id,
      title: certificate.title,
      issuer: certificate.issuer,
      issuedAt: toDateInput(certificate.issuedAt),
      expiresAt: "",
      credentialId: certificate.credentialId ?? "",
      verifyUrl: certificate.verifyUrl ?? "",
      source: certificate.source,
      fileUrl: certificate.fileUrl ?? "",
      thumbnailUrl: certificate.thumbnailUrl ?? "",
      issuerLogo: certificate.issuerLogo ?? "",
      skills: certificate.skills.join(", "),
      featured: certificate.featured,
      sortOrder: certificate.sortOrder,
    });
    setOpen(true);
  };

  const submit = async () => {
    // Business rule: external link uploads must carry a supporting thumbnail.
    if (form.source === "EXTERNAL_URL" && !form.thumbnailUrl && !form.issuerLogo) {
      toast.error("Untuk upload via link, wajib sertakan thumbnail/logo penerbit.");
      return;
    }
    if (form.source === "UPLOAD" && !form.fileUrl) {
      toast.error("Unggah file sertifikat terlebih dahulu.");
      return;
    }

    setSaving(true);
    const result = await actions.saveCertificate(form);
    setSaving(false);
    result.ok ? toast.success(result.message) : toast.error(result.message);
    if (result.ok) setOpen(false);
  };

  const remove = async (id: string) => {
    const result = await actions.deleteCertificate(id);
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Certificates"
        description="Upload serba bisa: drag & drop, file explorer, atau link eksternal (wajib thumbnail/logo)."
        action={
          <Button variant="accent" size="sm" onClick={startCreate}>
            <Plus className="size-3.5" /> Tambah Sertifikat
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {certificates.map((certificate) => {
          const preview = certificate.thumbnailUrl || certificate.fileUrl;
          return (
            <Panel key={certificate.id} className="flex flex-col overflow-hidden">
              <div className="relative aspect-[16/10] border-b border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt={certificate.title} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center">
                    <Award className="size-6 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute right-3 top-3">
                  <Badge tone={certificate.source === "EXTERNAL_URL" ? "glow" : "muted"}>
                    {certificate.source === "EXTERNAL_URL" ? "Link" : "Upload"}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{certificate.title}</p>
                    <p className="text-[0.7rem] text-muted-foreground">{certificate.issuer}</p>
                  </div>
                  <RowActions
                    onEdit={() => startEdit(certificate)}
                    onDelete={() => remove(certificate.id)}
                  />
                </div>
                <p className="mt-2 font-mono text-[0.65rem] text-muted-foreground">
                  {formatMonthYear(certificate.issuedAt)}
                </p>
              </div>
            </Panel>
          );
        })}
        {!certificates.length ? (
          <EmptyState>Belum ada sertifikat.</EmptyState>
        ) : null}
      </div>

      <Modal open={open} onOpenChange={setOpen} label="Form sertifikat" className="max-w-2xl">
        <div className="max-h-[85vh] overflow-y-auto p-7">
          <h3 className="editorial-title text-xl font-light">
            {form.id ? "Edit Sertifikat" : "Sertifikat Baru"}
          </h3>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Judul">
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Penerbit">
                <Input
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  placeholder="Dicoding / Coursera / Credly"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Terbit">
                <Input
                  type="date"
                  value={form.issuedAt}
                  onChange={(e) => setForm({ ...form, issuedAt: e.target.value })}
                />
              </Field>
              <Field label="Kedaluwarsa" hint="opsional">
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </Field>
              <Field label="Credential ID" hint="opsional">
                <Input
                  value={form.credentialId}
                  onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                />
              </Field>
            </div>

            {/* Source switch: file upload vs external URL */}
            <div className="flex rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-1">
              {[
                { id: "UPLOAD", label: "Upload File", icon: UploadCloud },
                { id: "EXTERNAL_URL", label: "Link Eksternal", icon: Link2 },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setForm({ ...form, source: option.id })}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs transition-colors",
                    form.source === option.id
                      ? "bg-[rgb(var(--surface2))] text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <option.icon className="size-3.5" />
                  {option.label}
                </button>
              ))}
            </div>

            {form.source === "UPLOAD" ? (
              <MediaUploader
                label="File Sertifikat"
                value={form.fileUrl}
                onChange={(url) => setForm({ ...form, fileUrl: url })}
                hint="Unggah gambar sertifikat (PNG/JPG) atau PDF."
              />
            ) : (
              <div className="space-y-4">
                <Field label="URL Verifikasi / Kredensial">
                  <Input
                    value={form.verifyUrl}
                    onChange={(e) => setForm({ ...form, verifyUrl: e.target.value })}
                    placeholder="https://www.credly.com/badges/…"
                  />
                </Field>

                <MediaUploader
                  label="Thumbnail / Logo Penerbit"
                  value={form.thumbnailUrl}
                  onChange={(url) => setForm({ ...form, thumbnailUrl: url })}
                  requireThumbnail
                  thumbnailValue={form.thumbnailUrl}
                  onThumbnailChange={(url) => setForm({ ...form, thumbnailUrl: url })}
                  hint="Untuk upload via link, thumbnail/logo wajib agar visual tetap konsisten."
                />
              </div>
            )}

            <Field label="Skills" hint="pisahkan dengan koma">
              <Input
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="JavaScript, React"
              />
            </Field>

            <div className="flex items-center justify-between rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] px-4 py-3">
              <span className="text-sm">Featured</span>
              <Switch
                checked={form.featured}
                onCheckedChange={(value) => setForm({ ...form, featured: value })}
              />
            </div>
          </div>

          <div className="mt-7 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={submit} disabled={saving || !form.title || !form.issuer}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}