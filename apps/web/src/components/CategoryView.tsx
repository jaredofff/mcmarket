"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { getCategoryInfo, type CategoryProduct } from "@/lib/categoryProducts";

type SortOption = "trending" | "newest" | "rating" | "featured";
type AccessTier = CategoryProduct["tier"];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "featured", label: "Featured" },
];

const ACCESS_TIERS: { value: AccessTier; label: string }[] = [
  { value: "free", label: "Gratis" },
  { value: "vip", label: "VIP" },
  { value: "legend", label: "Legend" },
];

interface CategoryViewProps {
  categoryName: "Setups" | "Configs" | "Builds" | "Webs";
}

interface PublicResource {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  coverImage: string;
  categories: string[];
  tags: string[];
  version: string;
  downloadCount: number;
  rating: number;
  isVipOnly: boolean;
  tier: string;
  createdAt: string;
  updatedAt: string;
}

function normalizeAccessTier(tier?: string | null, isVipOnly = false): CategoryProduct["tier"] {
  const normalizedTier = tier?.toLowerCase();

  if (normalizedTier === "legend" || normalizedTier === "elite") {
    return "legend";
  }

  if (normalizedTier === "vip" || normalizedTier === "premium" || isVipOnly) {
    return "vip";
  }

  return "free";
}

function getAccessLabel(tier: CategoryProduct["tier"]) {
  if (tier === "legend") return "LEGEND";
  if (tier === "vip") return "VIP";
  return "GRATIS";
}

function getDescriptionExcerpt(markdown: string, maxLength = 140) {
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

  if (!plainText) {
    return "Abre el recurso para ver la descripcion completa.";
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

function mapPublicResource(resource: PublicResource): CategoryProduct {
  const updatedAt = resource.updatedAt || resource.createdAt || new Date().toISOString();
  const tier = normalizeAccessTier(resource.tier, resource.isVipOnly);

  return {
    id: resource.id,
    title: resource.title,
    slug: resource.slug,
    category: (resource.categories?.[0] || "Setups") as CategoryProduct["category"],
    isFree: tier === "free",
    tier,
    rating: Number(resource.rating || 0),
    reviewCount: 0,
    sales: 0,
    downloads: resource.downloadCount || 0,
    image: resource.coverImage || "/logo.png",
    shortDescription: getDescriptionExcerpt(resource.description),
    longDescription: resource.description,
    features: [],
    version: resource.version,
    creator: {
      username: resource.author || "MC Market",
      avatar: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${encodeURIComponent(resource.author || "mc-market")}`,
      verified: true,
    },
    featured: false,
    tags: resource.tags || [],
    createdAt: updatedAt,
  } as CategoryProduct & { createdAt: string };
}

export default function CategoryView({ categoryName }: CategoryViewProps) {
  const categoryInfo = getCategoryInfo(categoryName);

  const [allProducts, setAllProducts] = useState<(CategoryProduct & { createdAt?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<AccessTier[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/plugins/search?limit=100&categories=${encodeURIComponent(categoryName)}`);
        if (!response.ok) {
          throw new Error("No se pudieron cargar los recursos");
        }

        const data = await response.json();
        setAllProducts(((data.items || []) as PublicResource[]).map(mapPublicResource));
      } catch (error) {
        console.error(`Error loading ${categoryName}:`, error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryName]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.creator.username.toLowerCase().includes(q)
      );
    }

    if (selectedTiers.length > 0) {
      result = result.filter((p) => selectedTiers.includes(p.tier));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b.sales - a.sales;
        case "rating":
          return b.rating - a.rating;
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [search, selectedTiers, sortBy, allProducts]);

  const toggleTier = (tier: AccessTier) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((item) => item !== tier) : [...prev, tier]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTiers([]);
    setSortBy("trending");
  };

  const activeFilterCount = selectedTiers.length;
  const catalogIsEmpty = !loading && allProducts.length === 0;

  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative w-full pt-24 pb-12 px-6 overflow-hidden">
        <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-[600px] h-[300px] rounded-full bg-amber-600/8 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{categoryInfo.emoji}</span>
            <div>
              <h1 className="font-outfit text-4xl font-black text-[#e8e4db]">{categoryName}</h1>
              <p className="text-[#8c8278] text-sm">{categoryInfo.description}</p>
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
            {filteredProducts.length} recursos disponibles
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 flex flex-col">
        <div className="flex gap-8 flex-1">
          {/* Sidebar */}
          <aside
            className={`
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0 lg:static
              fixed inset-y-0 left-0 z-40 w-72 lg:w-64 xl:w-72
              bg-[#141311] lg:bg-transparent
              border-r border-[#2d2a26] lg:border-0
              pt-20 lg:pt-0 px-6 lg:px-0
              overflow-y-auto
              transition-transform duration-300
              shrink-0
            `}
          >
            <div className="flex flex-col gap-6 sticky top-24">
              <div className="flex items-center justify-between">
                <span className="font-outfit font-bold text-sm uppercase tracking-widest text-[#a39c90]">
                  Filtros
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider"
                  >
                    Limpiar ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Nombre, tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-3 pr-3 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-sm text-[#e8e4db] placeholder-[#4a4540] focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Access */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-3">
                  Rango
                </label>
                <div className="flex flex-col gap-2">
                  {ACCESS_TIERS.map((tier) => {
                    const active = selectedTiers.includes(tier.value);
                    const count = allProducts.filter((p) => p.tier === tier.value).length;

                    return (
                      <button
                        key={tier.value}
                        onClick={() => toggleTier(tier.value)}
                        className={`flex items-center justify-between px-3 py-2 rounded-sm text-sm font-bold transition-all ${
                          active
                            ? "bg-amber-500/15 border border-amber-500/40 text-amber-400"
                            : "bg-[#1c1a17] border border-[#2d2a26] text-[#6b6459] hover:text-[#a39c90] hover:border-[#3d3830]"
                        }`}
                      >
                        <span>{tier.label}</span>
                        <span className={`text-xs ${active ? "text-amber-500" : "text-[#4a4540]"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
              <button
                className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-sm font-bold text-[#a39c90] hover:text-amber-400"
                onClick={() => setSidebarOpen(true)}
              >
                Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-[#6b6459] font-medium hidden sm:block">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-10 px-3 pr-8 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-sm font-bold text-[#e8e4db] focus:outline-none focus:border-amber-500/50"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-80 animate-pulse rounded-sm border border-[#2d2a26] bg-[#1c1a17]" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${categoryName.toLowerCase()}/${product.slug}`}
                    className="p-5 bg-[#1c1a17] border border-[#2d2a26] rounded-sm hover:border-amber-500/40 transition-all cursor-pointer flex flex-col group"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-[#141311] rounded-sm mb-4 group-hover:border-amber-500/30 transition-all">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity"
                      />
                      {product.featured && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-[#141311] text-xs font-black rounded-sm">
                          Destacado
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-[#e8e4db] mb-2 group-hover:text-amber-300 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-[#a39c90] mb-4 flex-1">{product.shortDescription}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-[#2d2a26]">
                      <span className="font-black text-amber-400">
                        {getAccessLabel(product.tier)}
                      </span>
                      <span className="text-xs text-[#6b6459]">★ {product.rating.toFixed(1)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="text-5xl">{catalogIsEmpty ? categoryInfo.emoji : "🔍"}</div>
                <h3 className="font-bold text-[#e8e4db] text-lg">
                  {catalogIsEmpty ? `Aún no hay ${categoryName.toLowerCase()} publicados` : "Sin resultados"}
                </h3>
                <p className="max-w-lg text-[#6b6459]">
                  {catalogIsEmpty
                    ? "Cuando cargues recursos reales desde el panel de administración, se mostrarán en esta categoría."
                    : "Intenta ajustar tus filtros"}
                </p>
                {catalogIsEmpty ? (
                  <Link
                    href="/admin/plugins/new"
                    className="px-6 py-2 rounded-sm bg-[#1c1a17] border border-[#3d3830] text-sm font-bold text-[#a39c90] hover:text-amber-400"
                  >
                    Cargar recurso
                  </Link>
                ) : (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 rounded-sm bg-[#1c1a17] border border-[#3d3830] text-sm font-bold text-[#a39c90] hover:text-amber-400"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
