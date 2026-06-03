import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-supabase-server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { toPublicPlugin, type PluginRecord } from "@/lib/plugin-records";
import { canDownloadResourceTier, getTrustedRoleFromMetadata } from "@/lib/roles";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export const runtime = "edge";

interface ProductPageProps {
  params: Promise<{ category: string; productId: string }>;
}

const CATEGORY_BY_PATH: Record<string, "Setups" | "Configs" | "Builds" | "Webs"> = {
  setups: "Setups",
  configs: "Configs",
  builds: "Builds",
  webs: "Webs",
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, productId } = await params;
  const categoryName = CATEGORY_BY_PATH[category.toLowerCase()];

  if (!categoryName) {
    notFound();
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    notFound();
  }

  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("slug", productId)
    .eq("published", true)
    .overlaps("categories", [categoryName])
    .single();

  if (error || !data) {
    notFound();
  }

  const resource = toPublicPlugin(data as PluginRecord);
  const rawResource = data as PluginRecord;
  const coverImage = resource.coverImage || "/logo.png";
  const session = await getCurrentSession();
  const role = getTrustedRoleFromMetadata(session?.user.app_metadata);
  const canDownload = Boolean(session) && canDownloadResourceTier(role, rawResource.tier, rawResource.is_vip_only);
  const tierLabel =
    rawResource.tier === "legend" || rawResource.tier === "elite"
      ? "Legend"
      : rawResource.tier === "vip" || rawResource.tier === "premium" || rawResource.is_vip_only
      ? "VIP"
      : "Gratis";

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center gap-2 text-sm text-[#6b6459]">
        <Link href="/" className="hover:text-amber-400">
          Inicio
        </Link>
        <span>/</span>
        <Link href={`/${category.toLowerCase()}`} className="font-bold text-amber-400 hover:text-amber-300">
          {categoryName}
        </Link>
        <span>/</span>
        <span className="truncate text-[#a39c90]">{resource.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0">
          <div className="relative mb-8 aspect-video overflow-hidden rounded-sm border border-[#2d2a26] bg-[#1c1a17]">
            <Image
              src={coverImage}
              alt={resource.title}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400">
              {categoryName}
            </span>
            <span className="rounded-sm border border-[#3d3830] bg-[#1c1a17] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#a39c90]">
              {tierLabel}
            </span>
          </div>

          <h1 className="font-outfit text-4xl font-black text-[#e8e4db] md:text-5xl">
            {resource.title}
          </h1>
          <p className="mt-3 text-sm font-bold text-[#8c8278]">por {resource.author}</p>

          <section className="mt-10 border-t border-[#2d2a26] pt-8">
            <h2 className="font-outfit text-2xl font-bold text-[#e8e4db]">Descripcion</h2>
            <div className="mt-5">
              <MarkdownRenderer content={resource.description} />
            </div>
          </section>
        </main>

        <aside className="h-fit rounded-sm border border-[#2d2a26] bg-[#1c1a17] p-6">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">Acceso requerido</p>
            <p className="mt-1 font-outfit text-4xl font-black text-amber-400">{tierLabel}</p>
          </div>

          <div className="space-y-3 border-y border-[#2d2a26] py-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#6b6459]">Version</span>
              <span className="font-bold text-[#e8e4db]">{resource.version}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#6b6459]">Descargas</span>
              <span className="font-bold text-[#e8e4db]">{resource.downloadCount}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#6b6459]">Rating</span>
              <span className="font-bold text-[#e8e4db]">{resource.rating.toFixed(1)}</span>
            </div>
          </div>

          {!session ? (
            <Link
              href={`/auth?next=/${category.toLowerCase()}/${resource.slug}`}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-sm bg-linear-to-b from-amber-400 to-yellow-600 font-black text-[#141311] shadow-[0_3px_0_#92400e] transition-all hover:brightness-110"
            >
              Iniciar sesion para descargar
            </Link>
          ) : canDownload ? (
            <Link
              href={`/api/resources/${resource.id}/download`}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-sm bg-linear-to-b from-amber-400 to-yellow-600 font-black text-[#141311] shadow-[0_3px_0_#92400e] transition-all hover:brightness-110"
            >
              Descargar recurso
            </Link>
          ) : (
            <Link
              href={`/membership?upgrade=${rawResource.tier || "vip"}`}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-sm border border-purple-500/30 bg-purple-500/10 font-black text-purple-300 transition-all hover:bg-purple-500/20"
            >
              Requiere {tierLabel}
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
