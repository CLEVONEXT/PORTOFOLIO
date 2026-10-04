"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { SKILL_CATEGORY_LABELS } from "@/lib/constants";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { EmptyState, Panel, PanelHeader, RowActions } from "@/components/admin/primitives";
import type { AdminActions, Skill } from "@/components/admin/types";

const EMPTY = {
  id: "",
  name: "",
  category: "FRONTEND",
  level: 70,
  colorHex: "",
  sortOrder: 0,
};

export function SkillsAdminSection({
  skills,
  actions,
}: {
  skills: Skill[];
  actions: AdminActions;
}) {
  const [form, setForm] = React.useState({ ...EMPTY });
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const startCreate = () => {
    setForm({ ...EMPTY, sortOrder: skills.length });
    setOpen(true);
  };

  const startEdit = (skill: Skill) => {
    setForm({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      level: skill.level,
      colorHex: skill.colorHex ?? "",
      sortOrder: skill.sortOrder,
    });
    setOpen(true);
  };

  const submit = async () => {
    setSaving(true);
    const result = await actions.saveSkill(form);
    setSaving(false);
    result.ok ? toast.success(result.message) : toast.error(result.message);
    if (result.ok) setOpen(false);
  };

  const remove = async (id: string) => {
    const result = await actions.deleteSkill(id);
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Skills"
        description="Keahlian koding per kategori dengan indikator level visual."
        action={
          <Button variant="accent" size="sm" onClick={startCreate}>
            <Plus className="size-3.5" /> Tambah Skill
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <Panel key={skill.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{skill.name}</p>
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {SKILL_CATEGORY_LABELS[skill.category] ?? skill.category}
                </p>
              </div>
              <RowActions onEdit={() => startEdit(skill)} onDelete={() => remove(skill.id)} />
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgb(var(--surface2))]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${skill.level}%`,
                  background: skill.colorHex
                    ? `linear-gradient(90deg, ${skill.colorHex}, ${skill.colorHex}aa)`
                    : "linear-gradient(90deg, #ff6a3d, #ff8a63)",
                }}
              />
            </div>
            <p className="mt-1.5 font-mono text-[0.65rem] text-muted-foreground">{skill.level}%</p>
          </Panel>
        ))}
        {!skills.length ? <EmptyState>Belum ada skill.</EmptyState> : null}
      </div>

      <Modal open={open} onOpenChange={setOpen} label="Form skill" className="max-w-md">
        <div className="p-7">
          <h3 className="editorial-title text-xl font-light">
            {form.id ? "Edit Skill" : "Skill Baru"}
          </h3>

          <div className="mt-6 space-y-4">
            <Field label="Nama">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>

            <Field label="Kategori">
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {Object.entries(SKILL_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={`Level: ${form.level}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgb(var(--surface2))] accent-[rgb(var(--ink))]"
              />
            </Field>

            <Field label="Warna" hint="hex opsional">
              <Input
                value={form.colorHex}
                onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                placeholder="#ff6a3d"
              />
            </Field>
          </div>

          <div className="mt-7 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={submit} disabled={saving || !form.name}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}