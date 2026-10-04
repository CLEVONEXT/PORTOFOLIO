import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SpotifyTrack = {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  coverArt: string | null;
  spotifyUrl: string | null;
  spotifyEmbed: string | null;
  durationSec: number | null;
  mood: string | null;
  isFavorite: boolean;
  sortOrder: number;
};

type SpotifyTokenResponse = { access_token?: string };
type SpotifySearchResponse = {
  tracks?: {
    items?: Array<{
      id: string;
      name: string;
      duration_ms: number;
      external_urls?: { spotify?: string };
      artists?: Array<{ name: string }>;
      album?: { name?: string; images?: Array<{ url: string }> };
    }>;
  };
};

/** Client-credentials token cache (module scope, per server instance). */
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 10_000) {
    return cachedToken.value;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "Spotify API belum dikonfigurasi. Isi SPOTIFY_CLIENT_ID dan SPOTIFY_CLIENT_SECRET.",
    );
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Gagal mengautentikasi ke Spotify.");

  const payload = (await response.json()) as SpotifyTokenResponse & {
    expires_in?: number;
  };
  if (!payload.access_token)
    throw new Error("Spotify tidak mengembalikan access token.");

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

/**
 * GET /api/spotify/search?q=keyword
 * Powers the admin playlist search bar. Returns normalised Song-shaped objects
 * so the UI can import a result straight into the create form.
 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json(
      { error: "Parameter q wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=8`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Pencarian Spotify gagal." },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as SpotifySearchResponse;

    const tracks: SpotifyTrack[] = (payload.tracks?.items ?? []).map(
      (item, index) => ({
        id: item.id,
        title: item.name,
        artist:
          item.artists?.map((artist) => artist.name).join(", ") ?? "Unknown",
        album: item.album?.name ?? null,
        coverArt: item.album?.images?.[0]?.url ?? null,
        spotifyUrl: item.external_urls?.spotify ?? null,
        spotifyEmbed: `https://open.spotify.com/embed/track/${item.id}`,
        durationSec: Math.round((item.duration_ms ?? 0) / 1000),
        mood: null,
        isFavorite: true,
        sortOrder: index,
      }),
    );

    return NextResponse.json({ tracks });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 503 },
    );
  }
}
