import { put, del } from "@vercel/blob";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/utils";

export type UploadedFile = {
  url: string;
  pathname: string;
  size: number;
  contentType: string;
};

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

/** True when Vercel Blob is configured; otherwise fall back to local disk. */
export function isBlobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function assertValid(file: File) {
  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran file melebihi 8MB.");
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    throw new Error(`Tipe file tidak didukung: ${file.type}`);
  }
}

function buildKey(file: File, folder: string): string {
  const ext = path.extname(file.name) || "";
  const base = slugify(path.basename(file.name, ext)) || "file";
  return `${folder}/${base}-${Date.now()}${ext}`;
}

/**
 * Universal upload: Vercel Blob in production, local `public/uploads` in dev.
 * Used by the certificate drag-and-drop / file-explorer upload flows.
 */
export async function uploadFile(
  file: File,
  folder = "uploads",
): Promise<UploadedFile> {
  assertValid(file);
  const key = buildKey(file, folder);

  if (isBlobEnabled()) {
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return {
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
      contentType: file.type,
    };
  }

  // Local fallback (development / self-hosted)
  await mkdir(path.join(LOCAL_UPLOAD_DIR, folder), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = path.basename(key);
  const destination = path.join(LOCAL_UPLOAD_DIR, folder, filename);
  await writeFile(destination, buffer);

  return {
    url: `/uploads/${folder}/${filename}`,
    pathname: key,
    size: file.size,
    contentType: file.type,
  };
}

/** Remove an uploaded asset (Blob or local). */
export async function deleteFile(url: string): Promise<void> {
  if (!url) return;
  try {
    if (isBlobEnabled() && url.startsWith("http")) {
      await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
      return;
    }
    if (url.startsWith("/uploads/")) {
      const relative = url.replace(/^\/uploads\//, "");
      await unlink(path.join(LOCAL_UPLOAD_DIR, relative));
    }
  } catch {
    // Non-fatal: orphaned file cleanup is best-effort.
  }
}

/** Download an external asset and re-host it (used for URL-based uploads). */
export async function importFromUrl(
  url: string,
  folder = "imports",
): Promise<UploadedFile> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Gagal mengunduh file dari URL tersebut.");

  const contentType =
    response.headers.get("content-type") ?? "application/octet-stream";
  const arrayBuffer = await response.arrayBuffer();
  const extension = contentType.split("/")[1]?.split(";")[0] ?? "bin";
  const filename = `${slugify(new URL(url).pathname.split("/").pop() ?? "asset")}.${extension}`;

  const file = new File([arrayBuffer], filename, { type: contentType });
  return uploadFile(file, folder);
}
