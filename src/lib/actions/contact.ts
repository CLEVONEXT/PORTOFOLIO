"use server";

import { submitContactMessage } from "@/lib/email";
import { contactSchema } from "@/lib/validations";

export type ContactActionState = {
  ok: boolean;
  message: string;
};

export async function sendContactMessage(
  _prev: ContactActionState | null,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    body: formData.get("body"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Data tidak valid.",
    };
  }

  return submitContactMessage(parsed.data);
}
