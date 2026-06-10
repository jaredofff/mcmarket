import { NextRequest, NextResponse } from "next/server";
import { toAdminPlugin, type PluginRecord } from "@/lib/plugin-records";
import { requireAdminRoute } from "@/lib/route-auth";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { sendResourceNotification } from "@/lib/discord-webhook";

export const runtime = "edge";

const RESOURCE_PATH_BY_CATEGORY: Record<string, string> = {
  Plugins: "plugins",
  Setups: "setups",
  Configs: "configs",
  Builds: "builds",
  Webs: "webs",
};

function getResourcePath(category: string, slug: string) {
  const section = RESOURCE_PATH_BY_CATEGORY[category] || "plugins";
  return `/${section}/${encodeURIComponent(slug)}`;
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminRoute();
    if (authError) return authError;

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ message: "Supabase admin client is not configured" }, { status: 500 });
    }

    const { id } = await params;
    const { data: existing, error: findError } = await supabase
      .from("plugins")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !existing) {
      return NextResponse.json({ message: findError?.message || "Plugin not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("plugins")
      .update({ published: true })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const wasAlreadyPublished = Boolean((existing as PluginRecord).published);
    if (!wasAlreadyPublished) {
      const resource = data as PluginRecord;
      const category = resource.categories?.[0] || "Recurso";

      await sendResourceNotification({
        title: resource.title,
        slug: resource.slug,
        description: resource.description,
        price: Number(resource.price || 0),
        coverImage: resource.cover_image,
        resourcePath: getResourcePath(category, resource.slug),
        resourceType: category,
      });
    }

    return NextResponse.json(toAdminPlugin(data as PluginRecord));
  } catch (error) {
    console.error("Error publishing plugin:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to publish plugin" },
      { status: 500 }
    );
  }
}
