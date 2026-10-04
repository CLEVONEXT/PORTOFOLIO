"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { saveSettings } from "@/lib/actions/admin";
import { SITE, SOCIAL_KEYS } from "@/lib/constants";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Panel, PanelHeader } from "@/components/admin/primitives";
import type { ActionResult, Settings } from "@/components/admin/types";

export function SocialAdminSection({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => {
      const payload = Object.fromEntries(formData.entries()) as Record<string, string>;
      return saveSettings(payload);
    },
    null as ActionResult | null,
  );

  React.useEffect(() => {
    if (!state) return;
    state.ok ? toast.success(state.message) : toast.error(state.message);
  }, [state]);

  return (
    <div className="space-y-6">
      <PanelHeader
        title="Social & Profile"
        description="Ubah tautan media sosial, identitas, dan bio yang tampil di landing page."
      />

      <form action={formAction} className="grid gap-6 lg:grid-cols-2">
        <Panel className="space-y-4 p-6">
          <h3 className="eyebrow text-[0.58rem]">Identitas</h3>

          <Field label="Brand">
            <Input name="site.brand" defaultValue={settings["site.brand"] ?? SITE.brand} />
          </Field>
          <Field label="Nama Pemilik">
            <Input name="site.owner" defaultValue={settings["site.owner"] ?? SITE.owner} />
          </Field>
          <Field label="Jurusan">
            <Input name="site.major" defaultValue={settings["site.major"] ?? SITE.major} />
          </Field>
          <Field label="Email">
            <Input
              name="site.email"
              type="email"
              defaultValue={settings["site.email"] ?? SITE.email}
            />
          </Field>
          <Field label="Tagline">
            <Input name="site.tagline" defaultValue={settings["site.tagline"] ?? ""} />
          </Field>
          <Field label="Bio">
            <Textarea name="profile.bio" defaultValue={settings["profile.bio"] ?? ""} />
          </Field>
          <Field label="Foto Profil (URL)">
            <Input name="profile.photo" defaultValue={settings["profile.photo"] ?? ""} />
          </Field>
        </Panel>

        <Panel className="space-y-4 p-6">
          <h3 className="eyebrow text-[0.58rem]">Media Sosial</h3>

          {SOCIAL_KEYS.map(({ key, label }) => (
            <Field key={key} label={label}>
              <Input
                name={key}
                defaultValue={settings[key] ?? ""}
                placeholder={`https://${label.toLowerCase()}.com/username`}
              />
            </Field>
          ))}

          <div className="pt-2">
            <Button type="submit" variant="accent" disabled={pending} className="w-full">
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Share2 className="size-4" />}
              Simpan Pengaturan
            </Button>
          </div>
        </Panel>
      </form>
    </div>
  );
}