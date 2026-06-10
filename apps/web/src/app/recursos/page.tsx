"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const categories = [
  {
    emoji: "🖥️",
    title: "Setups",
    desc: "Setups completos listos para desplegar tu servidor en minutos.",
    href: "/setups",
    count: 3,
  },
  {
    emoji: "⚙️",
    title: "Configs",
    desc: "Configuraciones profesionales y modelos 3D custom de alta calidad.",
    href: "/configs",
    count: 3,
  },
  {
    emoji: "🏗️",
    title: "Builds",
    desc: "Construcciones premium para lobbies, spawnpoints y más.",
    href: "/builds",
    count: 3,
  },
  {
    emoji: "🌐",
    title: "Webs",
    desc: "Webs y tiendas premium listas para tu servidor.",
    href: "/webs",
    count: 3,
  },
];

interface PublicResource {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  coverImage: string;
  categories: string[];
  tags: string[];
  downloadCount: number;
  rating: number;
  isVipOnly: boolean;
  tier: string;
}

function getDescriptionExcerpt(markdown: string, maxLength = 130) {
  const plainText = markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[\s>*-]+/gm, "")
    .replace(/[*_~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return "Abre el recurso para ver la descripcion completa.";
  if (plainText.length <= maxLength) return plainText;

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

function normalizeAccessTier(tier?: string | null, isVipOnly = false) {
  const normalizedTier = tier?.toLowerCase();

  if (normalizedTier === "legend" || normalizedTier === "elite") return "legend";
  if (normalizedTier === "vip" || normalizedTier === "premium" || isVipOnly) return "vip";

  return "free";
}

function getAccessLabel(tier?: string | null, isVipOnly = false) {
  const normalizedTier = normalizeAccessTier(tier, isVipOnly);

  if (normalizedTier === "legend") return "LEGEND";
  if (normalizedTier === "vip") return "VIP";
  return "GRATIS";
}

function getResourceHref(resource: PublicResource) {
  const primaryCategory = resource.categories?.[0]?.toLowerCase();

  if (primaryCategory === "plugins") {
    return `/plugins/${resource.slug}`;
  }

  if (primaryCategory === "setups" || primaryCategory === "configs" || primaryCategory === "builds" || primaryCategory === "webs") {
    return `/${primaryCategory}/${resource.slug}`;
  }

  return `/plugins/${resource.slug}`;
}

function ResourcesPageContent() {
  const searchParams = useSearchParams();
  const query = useMemo(() => searchParams.get("search")?.trim() || "", [searchParams]);
  const [results, setResults] = useState<PublicResource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadResults() {
      try {
        setLoading(true);
        const response = await fetch(`/api/plugins/search?limit=100&search=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los resultados");
        }

        const data = await response.json();
        setResults((data.items || []) as PublicResource[]);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error searching resources:", error);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadResults();

    return () => controller.abort();
  }, [query]);

  const isSearching = query.length > 0;

  return (
    <div className="w-full">
      <section className="relative w-full pt-28 pb-16 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-[600px] h-[300px] rounded-full bg-amber-600/8 blur-[140px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
          <h1 className="font-outfit text-5xl md:text-6xl font-black tracking-tight text-[#e8e4db] mb-4">
            {isSearching ? "Resultados para" : "Explora Todas"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600">
              {isSearching ? query : "nuestras Categorías"}
            </span>
          </h1>
          <p className="text-lg text-[#8c8278] max-w-2xl leading-relaxed">
            {isSearching
              ? "Buscando en plugins, setups, configs, builds y webs publicados."
              : "Descubre setups, configuraciones, builds y webs premium para llevar tu servidor al siguiente nivel."}
          </p>
        </div>
      </section>

      {isSearching ? (
        <section className="w-full max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-sm border border-[#2d2a26] bg-[#1c1a17]" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((resource) => (
                <Link
                  key={resource.id}
                  href={getResourceHref(resource)}
                  className="group flex h-full flex-col overflow-hidden rounded-sm border border-[#2d2a26] bg-[#1c1a17] transition-all hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-[4px_4px_0_rgba(245,158,11,0.15)]"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#141311]">
                    <img
                      src={resource.coverImage || "/logo.png"}
                      alt={resource.title}
                      className="h-full w-full object-cover opacity-75 transition-all duration-500 group-hover:scale-105 group-hover:opacity-95"
                    />
                    <span className="absolute left-3 top-3 rounded-sm border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs font-black uppercase tracking-widest text-amber-300 backdrop-blur">
                      {resource.categories?.[0] || "Recurso"}
                    </span>
                    <span className="absolute right-3 top-3 rounded-sm bg-amber-500 px-2 py-1 text-xs font-black uppercase tracking-widest text-[#141311]">
                      {getAccessLabel(resource.tier, resource.isVipOnly)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h2 className="font-outfit text-xl font-black text-[#e8e4db] transition-colors group-hover:text-amber-300">
                      {resource.title}
                    </h2>
                    <p className="flex-1 text-sm leading-relaxed text-[#a39c90]">
                      {getDescriptionExcerpt(resource.description)}
                    </p>
                    <div className="flex items-center justify-between border-t border-[#2d2a26] pt-4 text-xs font-bold uppercase tracking-widest">
                      <span className="text-[#6b6459]">{resource.author || "MC Market"}</span>
                      <span className="text-amber-400">★ {Number(resource.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-sm border border-dashed border-[#3d3830] bg-[#1c1a17]/70 px-6 py-12 text-center">
              <h2 className="font-outfit text-2xl font-black text-[#e8e4db]">Sin resultados</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#8c8278]">
                No encontramos recursos publicados que coincidan con tu busqueda.
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="w-full max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="group relative p-8 rounded-sm bg-[#1c1a17] border border-[#2d2a26] hover:border-amber-500/40 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10 transition-all" />

                  <div className="relative z-10">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">
                      {cat.emoji}
                    </div>
                    <h2 className="font-outfit font-black text-2xl text-[#e8e4db] mb-3 group-hover:text-amber-300 transition-colors">
                      {cat.title}
                    </h2>
                    <p className="text-sm text-[#a39c90] mb-6 leading-relaxed h-10">{cat.desc}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-[#2d2a26]">
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                        {cat.count} recursos
                      </span>
                      <span className="text-[#6b6459] group-hover:text-amber-400 transition-colors">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="relative w-full py-16 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 via-transparent to-amber-600/5 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h2 className="font-outfit text-3xl font-black text-[#e8e4db] mb-4">
                ¿No encuentras lo que buscas?
              </h2>
              <p className="text-[#8c8278] mb-8">
                Explora nuestro marketplace completo o contacta con nuestro equipo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/plugins"
                  className="px-6 py-3 rounded-sm bg-[#1c1a17] border border-[#3d3830] text-sm font-bold text-[#a39c90] hover:text-amber-400 hover:border-amber-500/50 transition-all"
                >
                  Ver Plugins
                </Link>
                <Link
                  href="/membership"
                  className="px-6 py-3 rounded-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-sm font-black text-[#141311] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                >
                  Obtén VIP
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#141311] text-[#e8e4db]">
          Cargando...
        </div>
      }
    >
      <ResourcesPageContent />
    </Suspense>
  );
}
