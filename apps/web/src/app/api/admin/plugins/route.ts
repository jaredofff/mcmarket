import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getCurrentUser } from "@/lib/auth-supabase-server";
import { parseList, slugify, toAdminPlugin, type PluginRecord } from "@/lib/plugin-records";
import { requireAdminRoute } from "@/lib/route-auth";
import { sendResourceNotification } from "@/lib/discord-webhook";

export const runtime = "edge";

const MEDIA_BUCKET = "plugin-media";
const FILES_BUCKET = "plugin-files";

function getString(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function getBoolean(formData: FormData, key: string) {
  return getString(formData, key).toLowerCase() === "true";
}

function getAccessTier(formData: FormData, fallback = "vip") {
  const tier = getString(formData, "tier", fallback).toLowerCase();
  return tier === "legend" ? "legend" : "vip";
}

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

async function uploadFile(bucket: string, folder: string, file: File | null, slug: string) {
  if (!file || file.size === 0) {
    return null;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin client is not configured");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const storagePath = `${folder}/${slug}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const publicUrl =
    bucket === MEDIA_BUCKET
      ? supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl
      : null;

  return {
    name: file.name,
    path: storagePath,
    publicUrl,
    size: file.size,
    type: file.type || "application/octet-stream",
  };
}

async function generateUniqueSlug(title: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin client is not configured");
  }

  const baseSlug = slugify(title) || `plugin-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const { data, error } = await supabase
      .from("plugins")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminRoute();
    if (authError) return authError;

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ message: "Supabase admin client is not configured" }, { status: 500 });
    }

    const params = request.nextUrl.searchParams;
    const page = Math.max(Number(params.get("page") || "1"), 1);
    const limit = Math.min(Math.max(Number(params.get("limit") || "10"), 1), 100);
    const search = params.get("search")?.trim();
    const status = params.get("status")?.trim();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("plugins")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (status === "published") {
      query = query.eq("published", true);
    }

    if (status === "draft") {
      query = query.eq("published", false);
    }

    const { data, error, count } = await query;
    if (error) {
      throw new Error(error.message);
    }

    const plugins = ((data || []) as PluginRecord[]).map(toAdminPlugin);
    const total = count || 0;

    return NextResponse.json({
      plugins,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching plugins:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch plugins" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminRoute();
    if (authError) return authError;

    const supabase = getSupabaseAdminClient();
    const currentUser = await getCurrentUser();
    if (!supabase) {
      return NextResponse.json({ message: "Supabase admin client is not configured" }, { status: 500 });
    }

    const formData = await request.formData();
    const title = getString(formData, "title");
    const description = getString(formData, "description");
    const version = getString(formData, "version", "1.0.0");
    const category = getString(formData, "category");

    if (!title || !description || !version || !category) {
      return NextResponse.json({ message: "Faltan campos obligatorios del recurso" }, { status: 400 });
    }

    const pluginSlug = await generateUniqueSlug(title);
    const coverImage = await uploadFile(MEDIA_BUCKET, "covers", formData.get("coverImage") as File | null, pluginSlug);
    const bannerImage = await uploadFile(MEDIA_BUCKET, "banners", formData.get("bannerImage") as File | null, pluginSlug);
    const resourceFile = await uploadFile(FILES_BUCKET, "resources", formData.get("pluginFile") as File | null, pluginSlug);

    const testedVersions = parseList(formData.get("testedVersions"));
    const categories = [category].filter(Boolean);
    const tier = getAccessTier(formData);
    const author =
      currentUser?.user_metadata?.full_name ||
      currentUser?.user_metadata?.name ||
      currentUser?.user_metadata?.username ||
      "MC Market";

    const published = getBoolean(formData, "published");
    const { data, error } = await supabase
      .from("plugins")
      .insert({
        title,
        slug: pluginSlug,
        author,
        description,
        price: 0,
        version,
        tier,
        tested_versions: testedVersions,
        categories,
        tags: categories,
        cover_image: coverImage?.publicUrl || null,
        cover_image_path: coverImage?.path || null,
        banner_image: bannerImage?.publicUrl || null,
        banner_image_path: bannerImage?.path || null,
        file_path: resourceFile?.path || null,
        file_name: resourceFile?.name || null,
        file_size: resourceFile?.size || null,
        file_mime_type: resourceFile?.type || null,
        is_vip_only: tier === "vip",
        published,
        created_by: currentUser?.id || null,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (published) {
      await sendResourceNotification({
        title,
        slug: pluginSlug,
        description,
        price: 0,
        coverImage: coverImage?.publicUrl,
        resourcePath: getResourcePath(category, pluginSlug),
        resourceType: category || "Recurso",
      });
    }

    return NextResponse.json(toAdminPlugin(data as PluginRecord), { status: 201 });
  } catch (error) {
    console.error("Error creating plugin:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "No se pudo crear el recurso" },
      { status: 500 }
    );
  }
}
