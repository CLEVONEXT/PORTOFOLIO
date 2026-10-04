"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Music4,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import { cn, formatDuration, toEmbedUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/field";

export type SongView = {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  coverArt?: string | null;
  audioUrl?: string | null;
  spotifyUrl?: string | null;
  spotifyEmbed?: string | null;
  durationSec?: number | null;
  mood?: string | null;
};

/**
 * Interactive playlist widget with a live search bar.
 * Supports two playback modes:
 *   • direct audio file (`audioUrl`) via the native <audio> element
 *   • Spotify/YouTube embed (`spotifyEmbed` / `spotifyUrl`) via iframe
 */
export function MusicPlayer({ songs }: { songs: SongView[] }) {
  const [query, setQuery] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

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

  const current = filtered[currentIndex] ?? filtered[0] ?? null;

  // Keep the index in range whenever the filtered list changes.
  React.useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [query]);

  const embedUrl = current
    ? toEmbedUrl(current.spotifyEmbed || current.spotifyUrl || "")
    : null;
  const isAudioMode = Boolean(current?.audioUrl);
  const isEmbedMode = !isAudioMode && Boolean(embedUrl);

  const selectSong = (id: string) => {
    const index = filtered.findIndex((song) => song.id === id);
    if (index < 0) return;
    setCurrentIndex(index);
    setProgress(0);
    setPlaying(isAudioMode || isEmbedMode);
  };

  const skip = (direction: 1 | -1) => {
    if (!filtered.length) return;
    setCurrentIndex((prev) => (prev + direction + filtered.length) % filtered.length);
    setProgress(0);
  };

  const togglePlay = () => {
    if (isAudioMode && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        void audioRef.current.play();
      }
      setPlaying(!playing);
      return;
    }
    setPlaying((prev) => !prev);
  };

  if (!songs.length) return null;

  return (
    <div className="glass glass-glow relative overflow-hidden rounded-3xl p-6 sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-ember/12 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
            <Music4 className="size-4 text-ember" />
          </span>
          <div>
            <p className="text-sm font-medium tracking-tight">Hobi & Favorites</p>
            <p className="text-[0.7rem] text-muted-foreground">
              {songs.length} lagu · playlist pribadi
            </p>
          </div>
        </div>

        {/* Equalizer */}
        {playing ? (
          <div className="flex h-6 items-end gap-[3px]" aria-hidden>
            {[1, 2, 3].map((bar) => (
              <span
                key={bar}
                className={cn(
                  "w-[3px] rounded-full bg-ember",
                  bar === 1 && "animate-equalize-1",
                  bar === 2 && "animate-equalize-2",
                  bar === 3 && "animate-equalize-3",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Search */}
      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari judul atau penyanyi…"
          aria-label="Cari lagu"
          className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ember/50 focus-visible:ring-2 focus-visible:ring-ember/20"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Bersihkan pencarian"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      {/* Now playing */}
      <AnimatePresence mode="wait">
        {current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-5"
          >
            <div className="flex items-center gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                {current.coverArt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.coverArt}
                    alt={current.title}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid size-full place-items-center">
                    <Music4 className="size-6 text-muted-foreground/60" />
                  </div>
                )}
                {playing ? (
                  <div className="absolute inset-0 bg-ink-950/45 backdrop-blur-[2px]" />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium tracking-tight">
                  {current.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {current.artist}
                  {current.album ? ` · ${current.album}` : ""}
                </p>
                {current.mood ? (
                  <Badge tone="muted" className="mt-2">
                    {current.mood}
                  </Badge>
                ) : null}
              </div>
            </div>

            {/* Embed (Spotify / YouTube) */}
            {isEmbedMode && embedUrl ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  src={embedUrl}
                  title={`Player ${current.title}`}
                  width="100%"
                  height="152"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="block w-full"
                />
              </div>
            ) : null}

            {/* Native audio controls */}
            {isAudioMode ? (
              <>
                <audio
                  ref={audioRef}
                  src={current.audioUrl ?? undefined}
                  onTimeUpdate={(event) => {
                    const el = event.currentTarget;
                    if (el.duration) setProgress((el.currentTime / el.duration) * 100);
                  }}
                  onEnded={() => skip(1)}
                  className="hidden"
                />
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ember to-ember-soft transition-[width] duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            ) : null}

            {/* Transport */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => skip(-1)}
                aria-label="Lagu sebelumnya"
                className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:text-foreground"
              >
                <SkipBack className="size-4" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Jeda" : "Putar"}
                className="grid size-11 place-items-center rounded-full bg-ember text-ink-950 shadow-[0_0_28px_-8px_rgba(255,106,61,0.9)] transition-transform hover:scale-105"
              >
                {playing ? <Pause className="size-5" /> : <Play className="size-5 pl-0.5" />}
              </button>
              <button
                type="button"
                onClick={() => skip(1)}
                aria-label="Lagu berikutnya"
                className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:text-foreground"
              >
                <SkipForward className="size-4" />
              </button>

              <div className="ml-auto flex items-center gap-2 text-muted-foreground">
                <Volume2 className="size-4" />
                <span className="font-mono text-[0.7rem] tabular-nums">
                  {formatDuration(current.durationSec)}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Tidak ada lagu yang cocok dengan “{query}”.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Playlist */}
      <div className="mt-6 max-h-64 space-y-1 overflow-y-auto pr-1 hide-scrollbar">
        {filtered.map((song, index) => {
          const isActive = current?.id === song.id;
          return (
            <button
              key={song.id}
              type="button"
              onClick={() => selectSong(song.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200",
                isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
              )}
            >
              <span
                className={cn(
                  "w-5 shrink-0 font-mono text-[0.68rem] tabular-nums",
                  isActive ? "text-ember" : "text-muted-foreground/70",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate text-[0.82rem]",
                    isActive ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {song.title}
                </span>
                <span className="block truncate text-[0.7rem] text-muted-foreground">
                  {song.artist}
                </span>
              </span>
              {isActive && playing ? (
                <span className="font-mono text-[0.62rem] uppercase tracking-widest text-ember">
                  On air
                </span>
              ) : (
                <span className="font-mono text-[0.68rem] text-muted-foreground/60">
                  {formatDuration(song.durationSec)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}