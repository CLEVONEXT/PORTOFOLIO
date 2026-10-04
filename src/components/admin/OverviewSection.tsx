"use client";

import * as React from "react";
import { Award, Boxes, Inbox, Music4, Route, Sparkles } from "lucide-react";
import { SKILL_CATEGORY_LABELS } from "@/lib/constants";
import { formatMonthYear } from "@/lib/utils";
import { Badge } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { EmptyState, Panel, PanelHeader, StatCard } from "@/components/admin/primitives";
import type { Certificate, Experience, Message, Project, SectionId, Song } from "@/components/admin/types";

export function OverviewSection({
  projects,
  certificates,
  experiences,
  songs,
  messages,
  onNavigate,
}: {
  projects: Project[];
  certificates: Certificate[];
  experiences: Experience[];
  songs: Song[];
  messages: Message[];
  onNavigate: (id: SectionId) => void;
}) {
  const unread = messages.filter((message) => !message.read).length;
  const featured = projects.filter((project) => project.featured).length;

  const recent = React.useMemo(
    () =>
      [...messages]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [messages],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Projects" value={projects.length} hint={`${featured} featured`} icon={Boxes} />
        <StatCard label="Certificates" value={certificates.length} hint="terverifikasi" icon={Award} />
        <StatCard label="Experience" value={experiences.length} hint="timeline entries" icon={Route} />
        <StatCard label="Playlist" value={songs.length} hint="lagu favorit" icon={Music4} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel className="p-6">
          <PanelHeader
            title="Aktivitas Terbaru"
            description={`${messages.length} pesan masuk · ${unread} belum dibaca`}
            action={
              <Button variant="outline" size="sm" onClick={() => onNavigate("messages")}>
                <Inbox className="size-3.5" /> Buka Inbox
              </Button>
            }
          />

          <div className="mt-5 space-y-2">
            {recent.length ? (
              recent.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center gap-4 rounded-2xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[rgb(var(--line))] bg-[rgb(var(--surface))] text-xs uppercase">
                    {message.name.slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      {message.subject || `Pesan dari ${message.name}`}
                    </p>
                    <p className="truncate text-[0.7rem] text-muted-foreground">
                      {message.email} · {formatMonthYear(message.createdAt)}
                    </p>
                  </div>
                  {!message.read ? <Badge tone="accent">Baru</Badge> : null}
                </div>
              ))
            ) : (
              <EmptyState>Belum ada pesan masuk.</EmptyState>
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="relative overflow-hidden p-6">
            <div className="relative">
              <Sparkles className="size-5 text-[rgb(var(--ink))]" />
              <h3 className="editorial-title mt-4 text-xl font-light">Quick Actions</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Tambah konten baru langsung dari sini.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="accent" size="sm" onClick={() => onNavigate("projects")}>
                  Project
                </Button>
                <Button variant="outline" size="sm" onClick={() => onNavigate("certificates")}>
                  Certificate
                </Button>
                <Button variant="outline" size="sm" onClick={() => onNavigate("playlist")}>
                  Lagu
                </Button>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <h3 className="eyebrow text-[0.58rem]">Kategori Projects</h3>
            <div className="mt-4 space-y-3">
              {Object.entries(SKILL_CATEGORY_LABELS).map(([key, label]) => {
                const count = projects.filter((project) => project.category === key).length;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-20 text-[0.7rem] text-muted-foreground">{label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgb(var(--surface))]">
                      <div
                        className="h-full rounded-full bg-[rgb(var(--cta))]"
                        style={{ width: `${Math.min(100, count * 25 + 8)}%` }}
                      />
                    </div>
                    <span className="font-mono text-[0.68rem] text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}