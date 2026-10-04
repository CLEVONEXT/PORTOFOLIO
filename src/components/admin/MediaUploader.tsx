"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileUp, Link2, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UploadMode = "drop" | "url";

/**
 * Universal media uploader used across the admin panel.
 * Three ingestion paths:
 *   1. Drag & drop onto the dashed zone
 *   2. Manual pick via the OS file explorer
 *   3. External URL (with an optional mandatory supporting thumbnail)
 */
export function MediaUploader({
  label,
  value,
  onChange,
  hint,
  requireThumbnail = false,
  thumbnailValue,
  onThumbnailChange,
  accept,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  requireThumbnail?: boolean;
  thumbnailValue?: string;
  onThumbnailChange?: (url: string) => void;
  accept?: Record<string, string[]>;
}) {
  const [mode, setMode] = React.useState<UploadMode>("drop");
  const [uploading, setUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = React.useCallback(
    async (files: FileList | File[] | null) => {
      const file = files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body });
        const payload = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !payload.url) {
          throw new Error(payload.error ?? "Upload gagal.");
        }
        onChange(payload.url);
        toast.success("File berhasil diunggah.");
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onChange],
  );

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setUrlInput("");
    if (requireThumbnail) {
      toast.info("Lengkapi thumbnail/logo penerbit agar visual konsisten.");
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
          {(["drop", "url"] as UploadMode[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[0.68rem] transition-colors",
                mode === option
                  ? "bg-white/[0.09] text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option === "drop" ? <UploadCloud className="size-3" /> : <Link2 className="size-3" />}
              {option === "drop" ? "Upload" : "Link"}
            </button>
          ))}
        </div>
      </div>

      {mode === "drop" ? (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            void handleFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-7 text-center transition-colors",
            dragActive
              ? "border-ember/70 bg-ember/10"
              : "border-white/14 bg-white/[0.025] hover:border-white/25",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept ? Object.values(accept).flat().join(",") : undefined}
            onChange={(event) => void handleFiles(event.target.files)}
          />
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-ember" />
          ) : (
            <FileUp className="size-5 text-muted-foreground" />
          )}
          <p className="text-xs text-muted-foreground">
            {dragActive ? "Lepaskan file di sini…" : "Drag & drop file, atau"}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[0.7rem] text-foreground transition-colors hover:border-white/25 disabled:opacity-50"
          >
            Pilih dari Explorer
          </button>
          <p className="text-[0.62rem] text-muted-foreground/70">
            PNG, JPG, WEBP, SVG, PDF · maks 8MB
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && applyUrl()}
            placeholder="https://…"
            className="h-10"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={applyUrl}
            className="h-10 shrink-0 px-4"
          >
            Pakai
          </Button>
        </div>
      )}

      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Pratinjau"
            className="size-11 rounded-lg border border-white/10 object-cover"
          />
          <span className="min-w-0 flex-1 truncate text-[0.7rem] text-muted-foreground">
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Hapus file"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : null}

      {hint ? <p className="text-[0.65rem] text-muted-foreground/80">{hint}</p> : null}

      {/* External-URL rule: a supporting thumbnail/logo is mandatory. */}
      {requireThumbnail && onThumbnailChange ? (
        <div className="rounded-xl border border-ember/25 bg-ember/[0.06] p-3">
          <p className="mb-2 text-[0.68rem] text-ember-soft">
            Wajib: thumbnail/logo penerbit (Credly, Coursera, Dicoding, dll.)
          </p>
          <Input
            value={thumbnailValue ?? ""}
            onChange={(event) => onThumbnailChange(event.target.value)}
            placeholder="https://cdn.credly.com/logo.png"
            className="h-9"
          />
        </div>
      ) : null}
    </div>
  );
}