"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("glass rounded-3xl", className)}>{children}</div>;
}

export function PanelHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="editorial-title text-2xl font-light">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ElementType;
}) {
  return (
    <Panel className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-ember/10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="eyebrow text-[0.58rem]">{label}</p>
          <p className="editorial-title mt-2 text-3xl font-light">{value}</p>
          {hint ? <p className="mt-1 text-[0.68rem] text-muted-foreground">{hint}</p> : null}
        </div>
        <span className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
          <Icon className="size-4 text-ember" />
        </span>
      </div>
    </Panel>
  );
}

export function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit"
        className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Pencil className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Hapus"
        className="grid size-8 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <Panel className="p-10 text-center text-sm text-muted-foreground">{children}</Panel>
  );
}