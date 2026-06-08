import { NextRequest, NextResponse } from "next/server";
import { toPublicPlugin, type PluginRecord } from "@/lib/plugin-records";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "edge";

const PLUGIN_CATALOG_SELECT = `
  id,
  title,
  slug,
  author,
  description,
  price,
  version,
  tier,
  tested_versions,
  dependencies,
  categories,
  tags,
  cover_image,
  cover_image_path,
  banner_image,
  banner_image_path,
  file_path,
  file_name,
  file_size,
  file_mime_type,
  is_vip_only,
  published,
  download_count,
  rating,
  created_by,
  created_at,
  updated_at
`;

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const params = request.nextUrl.searchParams;
    const limit = Math.min(Math.max(Number(params.get("limit") || "20"), 1), 100);
    const search = params.get("search")?.trim();
    const sortBy = params.get("sortBy") || "createdAt";
    const categories = [
      ...params.getAll("categories"),
      ...params.getAll("categories[]"),
    ].filter(Boolean);

    let query = supabase
      .from("plugins")
      .select(PLUGIN_CATALOG_SELECT, { count: "exact" })
      .eq("published", true)
      .limit(limit);

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (categories.length > 0) {
      query = query.overlaps("categories", categories);
    }

    if (sortBy === "downloads") {
      query = query.order("download_count", { ascending: false });
    } else if (sortBy === "rating") {
      query = query.order("rating", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      items: ((data || []) as PluginRecord[]).map(toPublicPlugin),
      total: count || 0,
    });
  } catch (error) {
    console.error("Error searching plugins:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to search plugins" },
      { status: 500 }
    );
  }
}
