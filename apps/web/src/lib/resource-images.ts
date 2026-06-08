const DEFAULT_MEDIA_BUCKET = "plugin-media";

export const RESOURCE_IMAGE_FALLBACK = "/logo.png";

function getPublicSupabaseStorageUrl(path: string, bucket = DEFAULT_MEDIA_BUCKET) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");

  if (!supabaseUrl) {
    return "";
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const pathWithoutBucket = normalizedPath.startsWith(`${bucket}/`)
    ? normalizedPath.slice(bucket.length + 1)
    : normalizedPath;

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${pathWithoutBucket}`;
}

export function normalizeResourceImageUrl(value?: string | null, fallback = RESOURCE_IMAGE_FALLBACK) {
  const rawValue = value?.trim();

  if (!rawValue) {
    return fallback;
  }

  if (/^(https?:|data:|blob:)/i.test(rawValue)) {
    return rawValue;
  }

  const normalizedPath = rawValue.replace(/\\/g, "/");

  if (normalizedPath.startsWith("/public/")) {
    return normalizedPath.replace(/^\/public/, "") || fallback;
  }

  if (normalizedPath.startsWith("public/")) {
    return `/${normalizedPath.replace(/^public\//, "")}`;
  }

  if (normalizedPath.startsWith("/uploads/")) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith("uploads/")) {
    return `/${normalizedPath}`;
  }

  if (normalizedPath.startsWith("/")) {
    return normalizedPath;
  }

  return getPublicSupabaseStorageUrl(normalizedPath) || fallback;
}
