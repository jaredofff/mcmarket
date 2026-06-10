import { NextRequest, NextResponse } from "next/server";
import { requireAdminRoute } from "@/lib/route-auth";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "edge";

const MEDIA_BUCKET = "plugin-media";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminRoute();
    if (authError) return authError;

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ message: "Supabase admin client is not configured" }, { status: 500 });
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json({ message: "No se recibio una imagen valida" }, { status: 400 });
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ message: "El archivo pegado no es una imagen" }, { status: 400 });
    }

    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ message: "La imagen no puede superar 5 MB" }, { status: 400 });
    }

    const extension = image.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
    const storagePath = `markdown/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(storagePath, image, {
      contentType: image.type,
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);

    return NextResponse.json({
      url: data.publicUrl,
      path: storagePath,
    });
  } catch (error) {
    console.error("Error uploading markdown image:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "No se pudo subir la imagen" },
      { status: 500 }
    );
  }
}
