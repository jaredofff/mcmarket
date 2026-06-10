export interface PluginRecord {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  description: string;
  price: number;
  version: string;
  tier: string;
  tested_versions: string[];
  dependencies: string[];
  categories: string[];
  tags: string[];
  cover_image: string | null;
  cover_image_path: string | null;
  banner_image: string | null;
  banner_image_path: string | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  file_mime_type: string | null;
  is_vip_only: boolean;
  published: boolean;
  download_count: number;
  rating: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function getSafeAuthor(author?: string | null) {
  if (!author || author.includes("@")) {
    return "MC Market";
  }

  return author;
}

export function toPublicPlugin(plugin: PluginRecord) {
  return {
    id: plugin.id,
    title: plugin.title,
    slug: plugin.slug,
    author: getSafeAuthor(plugin.author),
    description: plugin.description,
    coverImage: plugin.cover_image || "",
    bannerImage: plugin.banner_image || "",
    categories: plugin.categories || [],
    tags: plugin.tags || [],
    version: plugin.version,
    downloadCount: plugin.download_count || 0,
    rating: Number(plugin.rating || 0),
    isVipOnly: plugin.is_vip_only,
    price: Number(plugin.price || 0),
    tier: plugin.tier,
    testedVersions: plugin.tested_versions || [],
    createdAt: plugin.created_at,
    updatedAt: plugin.updated_at,
  };
}

export function toAdminPlugin(plugin: PluginRecord) {
  return {
    ...toPublicPlugin(plugin),
    author: getSafeAuthor(plugin.author),
    status: plugin.published ? "published" : "draft",
    published: plugin.published,
    category: plugin.categories?.[0] || "",
    testedVersions: (plugin.tested_versions || []).join(", "),
    dependencies: plugin.dependencies || [],
    fileName: plugin.file_name,
    fileSize: plugin.file_size,
  };
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseList(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
