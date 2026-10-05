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

    // Distinguish real server/configuration errors from wrong credentials.
    const type = (error as { type?: string })?.type ?? "";
    const message = (error as Error)?.message ?? "";

    if (type === "CredentialsSignin") {
      // Wrong email or password — or the admin account is not in the database.
      return {
        ok: false,
        message:
          "Email atau password salah. Jika yakin sandi benar, pastikan akun admin sudah dibuat di database (npm run db:seed).",
      };
    }

    if (/Can't reach database|PrismaClientInitializationError|PrismaClientKnownRequestError|connection/i.test(message)) {
      return {
        ok: false,
        message: "Database tidak dapat dihubungi. Periksa DATABASE_URL di environment deployment.",
      };
    }

    if (/Configuration|MissingSecret|secret/i.test(message)) {
      return {
        ok: false,
        message: "Konfigurasi server salah. Set AUTH_SECRET di environment deployment.",
      };
    }

    // Unknown error — show generic message plus the underlying error type so
    // debugging is possible without reading server logs.
    return {
      ok: false,
      message: `Gagal masuk. (${message.slice(0, 120) || type || "error tidak diketahui"})`,
    };
  }
}

export async function logoutAction(): Promise<void> {
  if (!authSecret) return;
  await signOut({ redirectTo: "/" });
}
