import { NextResponse } from "next/server";
import { requireAdminRoute } from "@/lib/route-auth";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { PluginRecord } from "@/lib/plugin-records";

export const runtime = "edge";

export async function GET() {
  try {
    const authError = await requireAdminRoute();
    if (authError) return authError;

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ message: "Supabase admin client is not configured" }, { status: 500 });
    }

    const [{ count: totalResources }, { count: publishedResources }, { count: draftResources }, recent] =
      await Promise.all([
        supabase.from("plugins").select("id", { count: "exact", head: true }),
        supabase.from("plugins").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("plugins").select("id", { count: "exact", head: true }).eq("published", false),
        supabase
          .from("plugins")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    return NextResponse.json({
      totalPlugins: totalResources || 0,
      publishedPlugins: publishedResources || 0,
      draftPlugins: draftResources || 0,
      totalDownloads: ((recent.data || []) as PluginRecord[]).reduce(
        (sum, resource) => sum + (resource.download_count || 0),
        0
      ),
      recentPlugins: ((recent.data || []) as PluginRecord[]).map((resource) => ({
        id: resource.id,
        title: resource.title,
        author: resource.author || "MC Market",
        createdAt: resource.created_at,
      })),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "No se pudieron cargar las métricas" },
      { status: 500 }
    );
  }
}
