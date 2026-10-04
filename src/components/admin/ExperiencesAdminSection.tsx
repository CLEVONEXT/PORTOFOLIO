"use client";

import * as React from "react";
import { Loader2, Plus, Route, Users } from "lucide-react";
import { toast } from "sonner";
import { EXPERIENCE_TYPE_LABELS } from "@/lib/constants";
import { formatMonthYear } from "@/lib/utils";
import { Badge, Field, Switch } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { EmptyState, Panel, PanelHeader, RowActions } from "@/components/admin/primitives";
import type { AdminActions, Experience } from "@/components/admin/types";

const EMPTY = {
  id: "",
  title: "",
  organization: "",
  type: "EDUCATION",
  location: "",
  description: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  logoUrl: "",
  tags: "",
  sortOrder: 0,
};

const toDateInput = (value: string | Date | null | undefined) =>
  value ? String(value).slice(0, 10) : "";

export function ExperiencesAdminSection({
  experiences,
  actions,
}: {
  experiences: Experience[];
  actions: AdminActions;
}) {
  const [form, setForm] = React.useState({ ...EMPTY });
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const startCreate = () => {
    setForm({ ...EMPTY, sortOrder: experiences.length });
    setOpen(true);
  };

  const startEdit = (item: Experience) => {
    setForm({
      id: item.id,
      title: item.title,
      organization: item.organization,
      type: item.type,
      location: item.location ?? "",
      description: item.description ?? "",
      startDate: toDateInput(item.startDate),
      endDate: toDateInput(item.endDate),
      isCurrent: item.isCurrent,
      logoUrl: item.logoUrl ?? "",
      tags: item.tags.join(", "),
      sortOrder: item.sortOrder,
    });
    setOpen(true);
  };

  const submit = async () => {
    setSaving(true);
    const result = await actions.saveExperience(form);
    setSaving(false);
    result.ok ? toast.success(result.message) : toast.error(result.message);
    if (result.ok) setOpen(false);
  };

  const remove = async (id: string) => {
    const result = await actions.deleteExperience(id);
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Experience & Education"
        description="Riwayat sekolah, kuliah, organisasi, dan pekerjaan untuk timeline halaman About."
        action={
          <Button variant="accent" size="sm" onClick={startCreate}>
            <Plus className="size-3.5" /> Tambah Entri
          </Button>
        }
      />

      <div className="space-y-3">
        {experiences.map((item) => (
          <Panel key={item.id} className="flex items-center gap-4 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
              {item.type === "WORK" || item.type === "ORGANIZATION" ? (
                <Users className="size-4 text-[rgb(var(--ink))]" />
              ) : (
                <Route className="size-4 text-[rgb(var(--ink))]" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="truncate text-[0.7rem] text-muted-foreground">
                {item.organization} · {formatMonthYear(item.startDate)} —{" "}
                {item.isCurrent ? "Sekarang" : formatMonthYear(item.endDate)}
              </p>
            </div>

            <Badge tone="muted">{EXPERIENCE_TYPE_LABELS[item.type] ?? item.type}</Badge>
            <RowActions onEdit={() => startEdit(item)} onDelete={() => remove(item.id)} />
          </Panel>
        ))}
        {!experiences.length ? <EmptyState>Belum ada riwayat.</EmptyState> : null}
      </div>

      <Modal open={open} onOpenChange={setOpen} label="Form experience" className="max-w-2xl">
        <div className="max-h-[85vh] overflow-y-auto p-7">
          <h3 className="editorial-title text-xl font-light">
            {form.id ? "Edit Entri" : "Entri Baru"}
          </h3>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Judul / Posisi">
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Institusi / Perusahaan">
                <Input
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipe">
                <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {Object.entries(EXPERIENCE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Lokasi" hint="opsional">
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mulai">
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="Selesai" hint={form.isCurrent ? "sedang berlangsung" : undefined}>
                <Input
                  type="date"
                  value={form.endDate}
                  disabled={form.isCurrent}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] px-4 py-3">
              <span className="text-sm">Masih berlangsung</span>
              <Switch
                checked={form.isCurrent}
                onCheckedChange={(value) =>
                  setForm({ ...form, isCurrent: value, endDate: value ? "" : form.endDate })
                }
              />
            </div>

            <Field label="Deskripsi">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>

            <Field label="Tags" hint="pisahkan dengan koma">
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </Field>
          </div>

          <div className="mt-7 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              variant="accent"
              onClick={submit}
              disabled={saving || !form.title || !form.organization || !form.startDate}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}