import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-supabase-server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { toPublicPlugin, type PluginRecord } from "@/lib/plugin-records";
import { canDownloadResourceTier, getTrustedRoleFromMetadata } from "@/lib/roles";

export const runtime = "edge";

interface PluginDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PluginDetailPage({ params }: PluginDetailPageProps) {
  const { slug } = await params;
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    notFound();
  }

  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    notFound();
  }

  const plugin = toPublicPlugin(data as PluginRecord);
  const rawPlugin = data as PluginRecord;
  const coverImage = plugin.coverImage || "/logo.png";
  const session = await getCurrentSession();
  const role = getTrustedRoleFromMetadata(session?.user.app_metadata);
  const canDownload = Boolean(session) && canDownloadResourceTier(role, rawPlugin.tier, rawPlugin.is_vip_only);
  const tierLabel =
    rawPlugin.tier === "legend" || rawPlugin.tier === "elite"
      ? "Legend"
      : rawPlugin.tier === "vip" || rawPlugin.tier === "premium" || rawPlugin.is_vip_only
      ? "VIP"
      : "Gratis";

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center gap-2 text-sm text-[#6b6459]">
        <Link href="/plugins" className="font-bold text-amber-400 hover:text-amber-300">
          Plugins
        </Link>
        <span>/</span>
        <span className="truncate text-[#a39c90]">{plugin.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0">
          <div className="relative mb-8 aspect-video overflow-hidden rounded-sm border border-[#2d2a26] bg-[#1c1a17]">
            <Image
              src={coverImage}
              alt={plugin.title}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {plugin.categories.map((category) => (
              <span
                key={category}
                className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400"
              >
                {category}
              </span>
            ))}
            {plugin.isVipOnly && (
              <span className="rounded-sm border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-yellow-400">
                VIP
              </span>
            )}
            <span className="rounded-sm border border-[#3d3830] bg-[#1c1a17] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#a39c90]">
              {tierLabel}
            </span>
          </div>

          <h1 className="font-outfit text-4xl font-black text-[#e8e4db] md:text-5xl">
            {plugin.title}
          </h1>
          <p className="mt-3 text-sm font-bold text-[#8c8278]">por {plugin.author}</p>

          <section className="mt-10 border-t border-[#2d2a26] pt-8">
            <h2 className="font-outfit text-2xl font-bold text-[#e8e4db]">Descripción</h2>
            <div className="mt-4 whitespace-pre-wrap leading-relaxed text-[#a39c90]">
              {plugin.description}
            </div>
          </section>
        </main>

        <aside className="h-fit rounded-sm border border-[#2d2a26] bg-[#1c1a17] p-6">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">Precio</p>
            <p className="mt-1 font-outfit text-4xl font-black text-amber-400">
              {plugin.price === 0 ? "Gratis" : `$${plugin.price.toFixed(2)}`}
            </p>
          </div>

          <div className="space-y-3 border-y border-[#2d2a26] py-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#6b6459]">Versión</span>
              <span className="font-bold text-[#e8e4db]">{plugin.version}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#6b6459]">Descargas</span>
              <span className="font-bold text-[#e8e4db]">{plugin.downloadCount}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#6b6459]">Rating</span>
              <span className="font-bold text-[#e8e4db]">{plugin.rating.toFixed(1)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#6b6459]">Acceso</span>
              <span className="font-bold text-[#e8e4db]">{tierLabel}</span>
            </div>
          </div>

          {!session ? (
            <Link
              href={`/auth?next=/plugins/${plugin.slug}`}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-sm bg-linear-to-b from-amber-400 to-yellow-600 font-black text-[#141311] shadow-[0_3px_0_#92400e] transition-all hover:brightness-110"
            >
              Iniciar sesión para descargar
            </Link>
          ) : canDownload ? (
            <Link
              href={`/api/resources/${plugin.id}/download`}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-sm bg-linear-to-b from-amber-400 to-yellow-600 font-black text-[#141311] shadow-[0_3px_0_#92400e] transition-all hover:brightness-110"
            >
              Descargar recurso
            </Link>
          ) : (
            <Link
              href={`/membership?upgrade=${rawPlugin.tier || "vip"}`}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-sm border border-purple-500/30 bg-purple-500/10 font-black text-purple-300 transition-all hover:bg-purple-500/20"
            >
              Requiere {tierLabel}
            </Link>
          )}

          <p className="mt-3 text-center text-xs leading-relaxed text-[#6b6459]">
            Todos pueden ver este recurso. Las descargas requieren sesión y el nivel correcto.
          </p>
        </aside>
      </div>
    </div>
  );
}
