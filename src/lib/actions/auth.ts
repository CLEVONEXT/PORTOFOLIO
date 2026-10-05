"use server";

import { signIn, signOut } from "@/lib/auth";
import { authSecret } from "@/lib/auth.config";
import { loginSchema } from "@/lib/validations";

export type LoginState = {
  ok: boolean;
  message: string;
};

export async function loginAction(
  _prev: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  if (!authSecret) {
    return { ok: false, message: "Autentikasi belum dikonfigurasi. Hubungi administrator." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Data tidak valid.",
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/admin",
    });
    return { ok: true, message: "Berhasil masuk." };
  } catch (error) {
    // Auth.js throws a redirect on success — re-throw so Next.js handles it.
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { ok: false, message: "Email atau password salah." };
  }
}

export async function logoutAction(): Promise<void> {
  if (!authSecret) return;
  await signOut({ redirectTo: "/" });
}
