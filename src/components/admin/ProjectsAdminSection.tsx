"use client";

import * as React from "react";
import { Boxes, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { Badge, Field, Switch } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { EmptyState, Panel, PanelHeader, RowActions } from "@/components/admin/primitives";
import type { AdminActions, Project } from "@/components/admin/types";

const EMPTY = {
  id: "",
  title: "",
  slug: "",
  summary: "",
  description: "",
  coverImage: "",
  techStack: "",
  demoUrl: "",
  repoUrl: "",
  category: "",
  year: undefined as number | undefined,
  featured: false,
  status: "PUBLISHED",
  sortOrder: 0,
};

export function ProjectsAdminSection({
  projects,
  actions,
}: {
  projects: Project[];
  actions: AdminActions;
}) {
  const [form, setForm] = React.useState({ ...EMPTY });
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const startCreate = () => {
    setForm({ ...EMPTY, sortOrder: projects.length });
    setOpen(true);
  };

  const startEdit = (project: Project) => {
    setForm({
      id: project.id,
      title: project.title,
      slug: project.slug,
      summary: project.summary ?? "",
      description: project.description ?? "",
      coverImage: project.coverImage ?? "",
      techStack: project.techStack.join(", "),
      demoUrl: project.demoUrl ?? "",
      repoUrl: project.repoUrl ?? "",
      category: project.category ?? "",
      year: project.year ?? undefined,
      featured: project.featured,
      status: project.status,
      sortOrder: project.sortOrder,
    });
    setOpen(true);
  };

  const submit = async () => {
    setSaving(true);
    const result = await actions.saveProject({
      ...form,
      slug: form.slug || slugify(form.title),
      year: form.year ? Number(form.year) : undefined,
    });
    setSaving(false);
    result.ok ? toast.success(result.message) : toast.error(result.message);
    if (result.ok) setOpen(false);
  };

  const remove = async (id: string) => {
    const result = await actions.deleteProject(id);
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Projects"
        description="Kelola daftar karya, tech stack, dan tautan demo/repository."
        action={
          <Button variant="accent" size="sm" onClick={startCreate}>
            <Plus className="size-3.5" /> Tambah Project
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <Panel key={project.id} className="flex gap-4 p-4">
            <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))]">
              {project.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.coverImage} alt={project.title} className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center">
                  <Boxes className="size-5 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{project.title}</p>
                  <p className="mt-0.5 font-mono text-[0.65rem] text-muted-foreground">
                    /{project.slug}
                  </p>
                </div>
                <RowActions onEdit={() => startEdit(project)} onDelete={() => remove(project.id)} />
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Badge tone={project.status === "PUBLISHED" ? "accent" : "muted"}>
                  {project.status}
                </Badge>
                {project.featured ? <Badge tone="glow">Featured</Badge> : null}
                {project.techStack.slice(0, 3).map((tech) => (
                  <Badge key={tech} tone="muted">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </Panel>
        ))}
        {!projects.length ? (
          <EmptyState>Belum ada project. Klik “Tambah Project”.</EmptyState>
        ) : null}
      </div>

      <Modal open={open} onOpenChange={setOpen} label="Form project" className="max-w-2xl">
        <div className="max-h-[85vh] overflow-y-auto p-7">
          <h3 className="editorial-title text-xl font-light">
            {form.id ? "Edit Project" : "Project Baru"}
          </h3>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Judul">
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Slug" hint="opsional">
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder={slugify(form.title) || "auto"}
                />
              </Field>
            </div>

            <Field label="Ringkasan">
              <Textarea
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="min-h-[80px]"
              />
            </Field>

            <Field label="Deskripsi">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>

            <MediaUploader
              label="Cover Image"
              value={form.coverImage}
              onChange={(url) => setForm({ ...form, coverImage: url })}
            />

            <Field label="Tech Stack" hint="pisahkan dengan koma">
              <Input
                value={form.techStack}
                onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                placeholder="Next.js, TypeScript, Prisma"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Demo URL">
                <Input value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
              </Field>
              <Field label="Repo URL">
                <Input value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Kategori">
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </Field>
              <Field label="Tahun">
                <Input
                  type="number"
                  value={form.year ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, year: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </Field>
              <Field label="Status">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </Select>
              </Field>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] px-4 py-3">
              <span className="text-sm">Tampilkan sebagai Featured</span>
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
            <Button variant="accent" onClick={submit} disabled={saving || !form.title}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}