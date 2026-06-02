import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-supabase-server";
import { type PluginRecord } from "@/lib/plugin-records";
import { canDownloadResourceTier, getTrustedRoleFromMetadata } from "@/lib/roles";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "edge";

const FILES_BUCKET = "plugin-files";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ message: "Supabase admin client is not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("plugins")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "Recurso no encontrado" }, { status: 404 });
    }

    const resource = data as PluginRecord;
    const nextUrl = `/plugins/${resource.slug}`;
    const session = await getCurrentSession();

    if (!session) {
      const url = new URL("/auth", request.url);
      url.searchParams.set("next", nextUrl);
      return NextResponse.redirect(url);
    }

    const role = getTrustedRoleFromMetadata(session.user.app_metadata);
    if (!canDownloadResourceTier(role, resource.tier, resource.is_vip_only)) {
      const url = new URL("/membership", request.url);
      url.searchParams.set("upgrade", resource.tier || "vip");
      return NextResponse.redirect(url);
    }

    if (!resource.file_path) {
      return NextResponse.json({ message: "Este recurso no tiene archivo disponible" }, { status: 404 });
    }

    const { data: signedUrl, error: signedUrlError } = await supabase.storage
      .from(FILES_BUCKET)
      .createSignedUrl(resource.file_path, 60, {
        download: resource.file_name || true,
      });

    if (signedUrlError || !signedUrl?.signedUrl) {
      throw new Error(signedUrlError?.message || "No se pudo generar la descarga");
    }

    await supabase
      .from("plugins")
      .update({ download_count: (resource.download_count || 0) + 1 })
      .eq("id", resource.id);

    return NextResponse.redirect(signedUrl.signedUrl);
  } catch (error) {
    console.error("Error downloading resource:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "No se pudo descargar el recurso" },
      { status: 500 }
    );
  }
}
