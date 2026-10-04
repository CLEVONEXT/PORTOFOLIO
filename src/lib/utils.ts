import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (Shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "moh arsyil" → "moh-arsyil" (slug generator). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Format a date as "Mei 2024" (Indonesian, short month). */
export function formatMonthYear(
  date: Date | string | null | undefined,
): string {
  if (!date) return "Sekarang";
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/** "2024-05-01" → "Mei 2024". */
export function formatRange(
  start: Date | string,
  end?: Date | string | null,
  isCurrent?: boolean,
): string {
  return `${formatMonthYear(start)} — ${isCurrent ? "Sekarang" : formatMonthYear(end)}`;
}

/** 215 → "3:35". */
export function formatDuration(totalSeconds?: number | null): string {
  if (!totalSeconds || totalSeconds <= 0) return "--:--";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Pick the first defined, non-empty value. */
export function firstDefined<T>(
  ...values: (T | null | undefined)[]
): T | undefined {
  return values.find(
    (value): value is T => value !== null && value !== undefined,
  );
}

/** True when the string looks like a valid http(s) URL. */
export function isHttpUrl(value?: string | null): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Convert a YouTube / Spotify / Vimeo link into an embeddable URL. */
export function toEmbedUrl(rawUrl: string): string | null {
  if (!isHttpUrl(rawUrl)) return null;
  const url = new URL(rawUrl);

  if (url.hostname.includes("spotify.com")) {
    if (url.pathname.startsWith("/embed")) return rawUrl;
    return `https://open.spotify.com/embed${url.pathname}`;
  }
  if (url.hostname.includes("youtube.com")) {
    const id = url.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.hostname === "youtu.be") {
    return `https://www.youtube.com/embed${url.pathname}`;
  }
  if (url.hostname.includes("vimeo.com")) {
    return `https://player.vimeo.com/video${url.pathname}`;
  }
  return rawUrl;
}

/** Safely parse a JSON string with a fallback. */
export function parseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Normalise a comma-separated input into a clean string array. */
export function toArray(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  const list = Array.isArray(value) ? value : value.split(",");
  return list.map((item) => item.trim()).filter(Boolean);
}
