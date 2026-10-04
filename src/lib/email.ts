import { Resend } from "resend";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export type ContactResult = {
  ok: boolean;
  message: string;
};

/**
 * Contact pipeline:
 *  1. Validate + honeypot check
 *  2. Persist the message (so nothing is ever lost)
 *  3. Deliver via Resend when configured
 */
export async function submitContactMessage(
  input: ContactInput,
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Data tidak valid.",
    };
  }

  const { name, email, subject, body, company } = parsed.data;

  // Honeypot triggered → pretend success, drop silently.
  if (company) {
    return { ok: true, message: "Terima kasih, pesan Anda terkirim." };
  }

  try {
    await prisma.message.create({
      data: { name, email, subject: subject || null, body },
    });
  } catch {
    // Database optional in demo mode; continue to email delivery.
  }

  if (!resend) {
    console.warn(
      "[contact] RESEND_API_KEY belum diisi — pesan hanya disimpan di database.",
    );
    return {
      ok: true,
      message: "Pesan tersimpan. (Mode demo: email belum dikonfigurasi.)",
    };
  }

  const to = process.env.CONTACT_TO_EMAIL ?? process.env.SITE_EMAIL;
  if (!to) {
    return { ok: false, message: "Email tujuan belum dikonfigurasi." };
  }

  const { error } = await resend.emails.send({
    from:
      process.env.CONTACT_FROM_EMAIL ?? "Clevonext.Dev <onboarding@resend.dev>",
    to: [to],
    replyTo: email,
    subject: subject
      ? `[Portfolio] ${subject}`
      : `[Portfolio] Pesan baru dari ${name}`,
    text: `Nama: ${name}\nEmail: ${email}\n\n${body}`,
    html: `
      <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 8px">Pesan baru dari Clevonext.Dev</h2>
        <p style="margin:0 0 4px"><strong>Nama:</strong> ${name}</p>
        <p style="margin:0 0 4px"><strong>Email:</strong> ${email}</p>
        <p style="margin:0 0 16px"><strong>Subjek:</strong> ${subject || "-"}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb" />
        <p style="white-space:pre-wrap;margin-top:16px">${body}</p>
      </div>
    `,
  });

  if (error) {
    return { ok: false, message: "Gagal mengirim email. Coba lagi nanti." };
  }

  return {
    ok: true,
    message: "Pesan terkirim. Terima kasih telah menghubungi!",
  };
}
