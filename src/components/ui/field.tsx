import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({
  className,
  children,
  hint,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { hint?: string }) {
  return (
    <label
      className={cn(
        "flex items-baseline justify-between gap-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {hint ? <span className="normal-case tracking-normal text-[0.7rem] opacity-70">{hint}</span> : null}
    </label>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? <Label hint={hint}>{label}</Label> : null}
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  label,
  className,
}: {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300 disabled:opacity-50",
        checked
          ? "border-[rgb(var(--line-strong))] bg-[rgb(var(--cta))]"
          : "border-[rgb(var(--line))] bg-[rgb(var(--surface2))]",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-[rgb(var(--cta))] shadow transition-transform duration-300",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "accent" | "glow" | "muted";
}) {
  const tones = {
    default: "border-[rgb(var(--line))] bg-[rgb(var(--surface2))] text-[rgb(var(--ink-dim))]",
    accent: "border-[rgb(var(--line-strong))] bg-[rgb(var(--surface2))] text-[rgb(var(--ink))]",
    glow: "border-[rgb(var(--line-strong))] bg-[rgb(var(--surface2))] text-[rgb(var(--ink-mute))]",
    muted: "border-[#2E2E2E] bg-[rgb(var(--surface))] text-[rgb(var(--ink-mute))]",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass rounded-2xl", className)} {...props}>
      {children}
    </div>
  );
}