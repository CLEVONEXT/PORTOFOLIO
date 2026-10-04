import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Universal file upload endpoint used by MediaUploader.
 * Accepts multipart/form-data with a `file` field and an optional `folder`.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "uploads";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File tidak ditemukan." },
        { status: 400 },
      );
    }

    const uploaded = await uploadFile(file, folder);
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Upload gagal." },
      { status: 400 },
    );
  }
}
