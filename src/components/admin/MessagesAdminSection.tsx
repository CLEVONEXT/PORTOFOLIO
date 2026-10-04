"use client";

import * as React from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn, formatMonthYear } from "@/lib/utils";
import { Badge } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState, Panel, PanelHeader } from "@/components/admin/primitives";
import type { AdminActions, Message } from "@/components/admin/types";

export function MessagesAdminSection({
  messages,
  actions,
}: {
  messages: Message[];
  actions: AdminActions;
}) {
  const [selected, setSelected] = React.useState<Message | null>(null);

  const toggleRead = async (message: Message) => {
    const result = await actions.markMessageRead(message.id, !message.read);
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  const remove = async (id: string) => {
    const result = await actions.deleteMessage(id);
    result.ok ? toast.success(result.message) : toast.error(result.message);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Messages"
        description="Pesan yang masuk melalui contact form di footer landing page."
      />

      <div className="space-y-2">
        {messages.map((message) => (
          <Panel
            key={message.id}
            className={cn("flex items-center gap-4 p-4", !message.read && "border-ember/25")}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-xs uppercase">
              {message.name.slice(0, 2)}
            </span>

            <button
              type="button"
              onClick={() => {
                setSelected(message);
                if (!message.read) void toggleRead(message);
              }}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-sm font-medium">
                {message.subject || `Pesan dari ${message.name}`}
              </p>
              <p className="truncate text-[0.7rem] text-muted-foreground">
                {message.email} · {formatMonthYear(message.createdAt)}
              </p>
            </button>

            {!message.read ? <Badge tone="accent">Baru</Badge> : <Badge tone="muted">Dibaca</Badge>}

            <button
              type="button"
              onClick={() => remove(message.id)}
              aria-label="Hapus"
              className="grid size-8 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
            >
              <Trash2 className="size-3.5" />
            </button>
          </Panel>
        ))}

        {!messages.length ? <EmptyState>Belum ada pesan.</EmptyState> : null}
      </div>

      <Modal
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
        label="Detail pesan"
        className="max-w-xl"
      >
        {selected ? (
          <div className="p-7">
            <Badge tone="muted">{formatMonthYear(selected.createdAt)}</Badge>
            <h3 className="editorial-title mt-3 text-xl font-light">
              {selected.subject || "Tanpa subjek"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {selected.name} · {selected.email}
            </p>

            <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {selected.body}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? "Pesan"}`}>
                  <ExternalLink className="size-3.5" /> Balas via Email
                </a>
              </Button>
              <Button variant="destructive" onClick={() => remove(selected.id)}>
                <Trash2 className="size-3.5" /> Hapus
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}