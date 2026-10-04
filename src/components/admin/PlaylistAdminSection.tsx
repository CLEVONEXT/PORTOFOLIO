"use client";

import * as React from "react";
import { Loader2, Music4, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge, Field, Switch } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { EmptyState, Panel, PanelHeader, RowActions } from "@/components/admin/primitives";
import type { AdminActions, Song } from "@/components/admin/types";

const EMPTY = {
  id: "",
  title: "",
  artist: "",
  album: "",
  coverArt: "",
  audioUrl: "",
  spotifyUrl: "",
  spotifyEmbed: "",
  durationSec: undefined as number | undefined,
  mood: "",
  isFavorite: true,
  sortOrder: 0,
};

/**
 * Playlist management with an admin-side SEARCH BAR that filters the local
 * database and (optionally) queries the Spotify catalogue via /api/spotify/search.
 */
export function PlaylistAdminSection({
  songs,
  actions,
}: {
  songs: Song[];
  actions: AdminActions;
}) {
  const [query, setQuery] = React.useState("");
  const [form, setForm] = React.useState({ ...EMPTY });
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [remoteResults, setRemoteResults] = React.useState<Song[]>([]);
  const [searching, setSearching] = React.useState(false);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return songs;
    return songs.filter((song) =>
      [song.title, song.artist, song.album ?? "", song.mood ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [songs, query]);

  /** Optional Spotify catalogue search (works when SPOTIFY_* env vars exist). */
  const searchSpotify = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      const payload = (await response.json()) as { tracks?: Song[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Spotify search tidak tersedia.");
      setRemoteResults(payload.tracks ?? []);
      if (!payload.tracks?.length) toast.info("Tidak ada hasil dari Spotify.");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSearching(false);
    }
  };

  const importTrack = (track: Song) => {
    setForm({
      id: "",
      title: track.title,
      artist: track.artist,
      album: track.album ?? "",
      coverArt: track.coverArt ?? "",
      audioUrl: "",
      spotifyUrl: track.spotifyUrl ?? "",
      spotifyEmbed: track.spotifyEmbed ?? "",
      durationSec: track.durationSec ?? undefined,
      mood: "",
      isFavorite: true,
      sortOrder: songs.length,
    });
    setOpen(true);
    toast.success("Lagu dimuat ke form — periksa lalu simpan.");
  };

  const startCreate = () => {
    setForm({ ...EMPTY, sortOrder: songs.length });
    setOpen(true);
  };

  const startEdit = (song: Song) => {
    setForm({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album ?? "",
      coverArt: song.coverArt ?? "",
      audioUrl: song.audioUrl ?? "",
      spotifyUrl: song.spotifyUrl ?? "",
      spotifyEmbed: song.spotifyEmbed ?? "",
      durationSec: song.durationSec ?? undefined,
      mood: song.mood ?? "",
      isFavorite: song.isFavorite,
      sortOrder: song.sortOrder,
    });
    setOpen(true);
  };

  const submit = async () => {
    setSaving(true);
    const result = await actions.saveSong(form);
    setSaving(false);
    result.ok ? toast.success(result.message) : toast.error(result.message);
    if (result.ok) setOpen(false);
  };

  const remove = async (id: string) => {
    const result = await actions.deleteSong(id);
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  const move = async (index: number, direction: -1 | 1) => {
    const next = [...songs];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    const result = await actions.reorderSongs(next.map((song) => song.id));
    result.ok ? toast.success("Urutan diperbarui.") : toast.error(result.message);
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Playlist & Hobi"
        description="Kelola lagu favorit, urutan, cover art, dan sumber audio/Spotify."
        action={
          <Button variant="accent" size="sm" onClick={startCreate}>
            <Plus className="size-3.5" /> Tambah Lagu
          </Button>
        }
      />

      {/* ── Admin search bar ─────────────────────────────────────────────── */}
      <Panel className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && searchSpotify()}
              placeholder="Cari lagu di database atau Spotify…"
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={searchSpotify}
            disabled={searching || !query.trim()}
            className="shrink-0"
          >
            {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Cari di Spotify
          </Button>
        </div>

        {remoteResults.length ? (
          <div className="mt-4 space-y-2">
            <p className="eyebrow text-[0.58rem]">Hasil Spotify</p>
            {remoteResults.map((track) => (
              <div
                key={track.spotifyUrl ?? track.title}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"
              >
                <div className="size-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                  {track.coverArt ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={track.coverArt} alt={track.title} className="size-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{track.title}</p>
                  <p className="truncate text-[0.7rem] text-muted-foreground">{track.artist}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => importTrack(track)}>
                  <Plus className="size-3.5" /> Import
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </Panel>

      {/* ── Song list ────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        {filtered.map((song, index) => (
          <Panel key={song.id} className="flex items-center gap-4 p-3.5">
            <span className="w-6 text-center font-mono text-[0.68rem] text-muted-foreground">
              {index + 1}
            </span>

            <div className="size-11 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
              {song.coverArt ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={song.coverArt} alt={song.title} className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center">
                  <Music4 className="size-4 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{song.title}</p>
              <p className="truncate text-[0.7rem] text-muted-foreground">
                {song.artist}
                {song.album ? ` · ${song.album}` : ""}
              </p>
            </div>

            {song.mood ? <Badge tone="muted">{song.mood}</Badge> : null}

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                aria-label="Naikkan urutan"
                className="grid size-7 place-items-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:text-foreground"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                aria-label="Turunkan urutan"
                className="grid size-7 place-items-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:text-foreground"
              >
                ↓
              </button>
            </div>

            <RowActions onEdit={() => startEdit(song)} onDelete={() => remove(song.id)} />
          </Panel>
        ))}

        {!filtered.length ? (
          <EmptyState>
            {query ? `Tidak ada lagu cocok dengan “${query}”.` : "Belum ada lagu di playlist."}
          </EmptyState>
        ) : null}
      </div>

      {/* ── Form modal ───────────────────────────────────────────────────── */}
      <Modal open={open} onOpenChange={setOpen} label="Form lagu" className="max-w-2xl">
        <div className="max-h-[85vh] overflow-y-auto p-7">
          <h3 className="editorial-title text-xl font-light">
            {form.id ? "Edit Lagu" : "Lagu Baru"}
          </h3>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Judul">
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Penyanyi">
                <Input value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Album" hint="opsional">
                <Input value={form.album} onChange={(e) => setForm({ ...form, album: e.target.value })} />
              </Field>
              <Field label="Mood" hint="opsional">
                <Input
                  value={form.mood}
                  onChange={(e) => setForm({ ...form, mood: e.target.value })}
                  placeholder="Focus / Calm"
                />
              </Field>
            </div>

            <MediaUploader
              label="Cover Art"
              value={form.coverArt}
              onChange={(url) => setForm({ ...form, coverArt: url })}
            />

            <Field label="Spotify Embed URL">
              <Input
                value={form.spotifyEmbed}
                onChange={(e) => setForm({ ...form, spotifyEmbed: e.target.value })}
                placeholder="https://open.spotify.com/embed/track/…"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Spotify URL" hint="opsional">
                <Input
                  value={form.spotifyUrl}
                  onChange={(e) => setForm({ ...form, spotifyUrl: e.target.value })}
                />
              </Field>
              <Field label="Durasi (detik)" hint="opsional">
                <Input
                  type="number"
                  value={form.durationSec ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      durationSec: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Audio URL" hint="mp3/ogg — alternatif embed">
              <Input
                value={form.audioUrl}
                onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
              />
            </Field>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="text-sm">Tampilkan di playlist favorit</span>
              <Switch
                checked={form.isFavorite}
                onCheckedChange={(value) => setForm({ ...form, isFavorite: value })}
              />
            </div>
          </div>

          <div className="mt-7 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              variant="accent"
              onClick={submit}
              disabled={saving || !form.title || !form.artist}
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