"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { getCategoryProducts, getCategoryInfo, type CategoryProduct } from "@/lib/categoryProducts";

type SortOption = "trending" | "newest" | "price-asc" | "price-desc" | "rating" | "featured";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured" },
];

interface CategoryViewProps {
  categoryName: "Setups" | "Configs" | "Builds" | "Webs";
}

export default function CategoryView({ categoryName }: CategoryViewProps) {
  const categoryInfo = getCategoryInfo(categoryName);
  const allProducts = getCategoryProducts(categoryName);

  const [search, setSearch] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

    if (showFreeOnly) {
      result = result.filter((p) => p.isFree);
    }

    if (!showFreeOnly) {
      result = result.filter(
        (p) => p.isFree || (p.price >= priceRange[0] && p.price <= priceRange[1])
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b.sales - a.sales;
        case "rating":
          return b.rating - a.rating;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

    return result;
  }, [search, showFreeOnly, priceRange, sortBy, allProducts]);

  const clearFilters = () => {
    setSearch("");
    setShowFreeOnly(false);
    setPriceRange([0, 50]);
    setSortBy("trending");
  };

  const activeFilterCount = (showFreeOnly ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 50 ? 1 : 0);

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

              {/* Price */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                    Precio Máx
                  </label>
                  <span className="text-xs font-black text-amber-400">
                    {priceRange[1] >= 50 ? "Any" : `$${priceRange[1]}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-amber-500 cursor-pointer"
                  disabled={showFreeOnly}
                />
              </div>

              {/* Free only */}
              <button
                onClick={() => setShowFreeOnly((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-sm border font-bold text-sm transition-all ${
                  showFreeOnly
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-[#1c1a17] border-[#2d2a26] text-[#6b6459] hover:text-[#a39c90]"
                }`}
              >
                <span>Solo gratis</span>
              </button>
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
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${categoryName.toLowerCase()}/${product.id}`}
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
                        {product.isFree ? "GRATIS" : `$${product.price.toFixed(2)}`}
                      </span>
                      <span className="text-xs text-[#6b6459]">★ {product.rating.toFixed(1)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="text-5xl">🔍</div>
                <h3 className="font-bold text-[#e8e4db] text-lg">Sin resultados</h3>
                <p className="text-[#6b6459]">Intenta ajustar tus filtros</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 rounded-sm bg-[#1c1a17] border border-[#3d3830] text-sm font-bold text-[#a39c90] hover:text-amber-400"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
