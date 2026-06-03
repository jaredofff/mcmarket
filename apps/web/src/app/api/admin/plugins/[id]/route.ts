import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { parseList, toAdminPlugin, type PluginRecord } from "@/lib/plugin-records";
import { requireAdminRoute } from "@/lib/route-auth";

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

async function uploadReplacement(bucket: string, folder: string, file: File | null, slug: string) {
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

  return {
    name: file.name,
    path: storagePath,
    publicUrl:
      bucket === MEDIA_BUCKET
        ? supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl
        : null,
    size: file.size,
    type: file.type || "application/octet-stream",
  };
}

async function removeStoredFile(bucket: string, path: string | null) {
  if (!path) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return;
  }

  await supabase.storage.from(bucket).remove([path]);
}

export async function GET(
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
    const { data, error } = await supabase.from("plugins").select("*").eq("id", id).single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    return NextResponse.json(toAdminPlugin(data as PluginRecord));
  } catch (error) {
    console.error("Error fetching plugin:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch plugin" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
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

    const current = existing as PluginRecord;
    const formData = await request.formData();
    const category = getString(formData, "category");
    const coverImage = await uploadReplacement(MEDIA_BUCKET, "covers", formData.get("coverImage") as File | null, current.slug);
    const bannerImage = await uploadReplacement(MEDIA_BUCKET, "banners", formData.get("bannerImage") as File | null, current.slug);
    const resourceFile = await uploadReplacement(FILES_BUCKET, "resources", formData.get("pluginFile") as File | null, current.slug);

    if (coverImage) await removeStoredFile(MEDIA_BUCKET, current.cover_image_path);
    if (bannerImage) await removeStoredFile(MEDIA_BUCKET, current.banner_image_path);
    if (resourceFile) await removeStoredFile(FILES_BUCKET, current.file_path);

    const tier = getAccessTier(formData, current.tier);

    const updateData: Record<string, unknown> = {
      title: getString(formData, "title", current.title),
      description: getString(formData, "description", current.description),
      price: 0,
      version: getString(formData, "version", current.version),
      tier,
      tested_versions: parseList(formData.get("testedVersions")),
      categories: [category].filter(Boolean),
      tags: [category].filter(Boolean),
      is_vip_only: tier === "vip",
      published: getBoolean(formData, "published"),
    };

    if (coverImage) {
      updateData.cover_image = coverImage.publicUrl;
      updateData.cover_image_path = coverImage.path;
    }

    if (bannerImage) {
      updateData.banner_image = bannerImage.publicUrl;
      updateData.banner_image_path = bannerImage.path;
    }

    if (resourceFile) {
      updateData.file_path = resourceFile.path;
      updateData.file_name = resourceFile.name;
      updateData.file_size = resourceFile.size;
      updateData.file_mime_type = resourceFile.type;
    }

    const { data, error } = await supabase
      .from("plugins")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(toAdminPlugin(data as PluginRecord));
  } catch (error) {
    console.error("Error updating plugin:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "No se pudo actualizar el recurso" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const current = existing as PluginRecord;
    await removeStoredFile(MEDIA_BUCKET, current.cover_image_path);
    await removeStoredFile(MEDIA_BUCKET, current.banner_image_path);
    await removeStoredFile(FILES_BUCKET, current.file_path);

    const { error } = await supabase.from("plugins").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "Plugin deleted", pluginId: id });
  } catch (error) {
    console.error("Error deleting plugin:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to delete plugin" },
      { status: 500 }
    );
  }
}
