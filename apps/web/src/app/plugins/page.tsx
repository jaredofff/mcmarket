"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PluginCard from "@/components/PluginCard";
import {
  MOCK_PLUGINS,
  CATEGORIES,
  MINECRAFT_VERSIONS,
  type Category,
} from "@/lib/mockData";

type SortOption = "trending" | "newest" | "price-asc" | "price-desc" | "rating" | "featured";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured" },
];

export default function PluginsExplorer() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    searchParams.get("category") ? [searchParams.get("category") as Category] : []
  );
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) ?? "trending"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleVersion = (v: string) => {
    setSelectedVersions((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedVersions([]);
    setShowFreeOnly(false);
    setPriceRange([0, 50]);
    setSortBy("trending");
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedVersions.length +
    (showFreeOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 50 ? 1 : 0);

  const filteredPlugins = useMemo(() => {
    let result = [...MOCK_PLUGINS];

    // Search
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

    // Categories
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Versions
    if (selectedVersions.length > 0) {
      result = result.filter((p) =>
        selectedVersions.some((v) => p.testedVersions.includes(v))
      );
    }

    // Free only
    if (showFreeOnly) {
      result = result.filter((p) => p.isFree);
    }

    // Price range (only for non-free)
    if (!showFreeOnly) {
      result = result.filter(
        (p) => p.isFree || (p.price >= priceRange[0] && p.price <= priceRange[1])
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "trending":  return b.sales - a.sales;
        case "newest":    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "rating":    return b.rating - a.rating;
        case "price-asc": return a.price - b.price;
        case "price-desc":return b.price - a.price;
        case "featured":  return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:          return 0;
      }
    });

    return result;
  }, [search, selectedCategories, selectedVersions, showFreeOnly, priceRange, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 flex flex-col">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">
          {filteredPlugins.length} results
        </p>
        <h1 className="font-outfit text-4xl font-black text-[#e8e4db]">Plugin Marketplace</h1>
      </div>

      <div className="flex gap-8 flex-1">
        {/* ── Sidebar ─────────────────────────────────── */}
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
            {/* Sidebar Header */}
            <div className="flex items-center justify-between">
              <span className="font-outfit font-bold text-sm uppercase tracking-widest text-[#a39c90]">
                Filters
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider"
                >
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-2">
                Search
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6459]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="plugin-search"
                  type="text"
                  placeholder="Plugin name, tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-sm text-[#e8e4db] placeholder-[#4a4540] focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-3">
                Category
              </label>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => {
                  const count = MOCK_PLUGINS.filter((p) => p.category === cat).length;
                  const active = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      id={`filter-cat-${cat.toLowerCase()}`}
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center justify-between px-3 py-2 rounded-sm text-sm font-bold transition-all ${
                        active
                          ? "bg-amber-500/15 border border-amber-500/40 text-amber-400"
                          : "bg-transparent border border-transparent text-[#6b6459] hover:text-[#a39c90] hover:bg-[#1c1a17]"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs ${active ? "text-amber-500" : "text-[#4a4540]"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MC Version */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-3">
                Minecraft Version
              </label>
              <div className="flex flex-wrap gap-2">
                {MINECRAFT_VERSIONS.map((v) => {
                  const active = selectedVersions.includes(v);
                  return (
                    <button
                      key={v}
                      id={`filter-version-${v}`}
                      onClick={() => toggleVersion(v)}
                      className={`px-3 py-1 rounded-sm text-xs font-bold border transition-all ${
                        active
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                          : "bg-[#1c1a17] border-[#2d2a26] text-[#6b6459] hover:text-[#a39c90] hover:border-[#3d3830]"
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                  Max Price
                </label>
                <span className="text-xs font-black text-amber-400">
                  {priceRange[1] >= 50 ? "Any" : `$${priceRange[1]}`}
                </span>
              </div>
              <input
                id="filter-price-range"
                type="range"
                min={0}
                max={50}
                step={1}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-amber-500 cursor-pointer"
                disabled={showFreeOnly}
              />
              <div className="flex justify-between text-xs text-[#4a4540] mt-1">
                <span>$0</span>
                <span>$50+</span>
              </div>
            </div>

            {/* Free only toggle */}
            <div>
              <button
                id="filter-free-only"
                onClick={() => setShowFreeOnly((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-sm border font-bold text-sm transition-all ${
                  showFreeOnly
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-[#1c1a17] border-[#2d2a26] text-[#6b6459] hover:text-[#a39c90] hover:border-[#3d3830]"
                }`}
              >
                <span>Free resources only</span>
                <div
                  className={`w-9 h-5 rounded-none transition-colors flex items-center ${
                    showFreeOnly ? "bg-emerald-500" : "bg-[#2d2a26]"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-none shadow transition-transform mx-0.5 ${
                      showFreeOnly ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Main Content ─────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4">
            {/* Mobile filter toggle */}
            <button
              className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-sm font-bold text-[#a39c90] hover:text-amber-400 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
              </svg>
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            {/* Sort */}
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-[#6b6459] font-medium hidden sm:block">Sort:</span>
              <select
                id="plugin-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-10 px-3 pr-8 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-sm font-bold text-[#e8e4db] focus:outline-none focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b6459' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px" }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {(selectedCategories.length > 0 || selectedVersions.length > 0 || showFreeOnly) && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-amber-500/15 border border-amber-500/40 text-xs font-bold text-amber-400 hover:bg-amber-500/25 transition-colors"
                >
                  {cat}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              {selectedVersions.map((v) => (
                <button
                  key={v}
                  onClick={() => toggleVersion(v)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-amber-500/15 border border-amber-500/40 text-xs font-bold text-amber-400 hover:bg-amber-500/25 transition-colors"
                >
                  MC {v}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              {showFreeOnly && (
                <button
                  onClick={() => setShowFreeOnly(false)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-emerald-500/15 border border-emerald-500/40 text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-colors"
                >
                  Free only
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Grid or Empty state */}
          {filteredPlugins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlugins.map((plugin) => (
                <PluginCard key={plugin.id} plugin={plugin} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-4">
              <div className="w-16 h-16 rounded-sm bg-[#1c1a17] border border-[#2d2a26] flex items-center justify-center text-3xl shadow-[4px_4px_0_rgba(0,0,0,0.4)]">
                🔍
              </div>
              <div>
                <h3 className="font-outfit font-bold text-xl text-[#e8e4db] mb-1">No plugins found</h3>
                <p className="text-[#6b6459]">Try adjusting your filters or search query.</p>
              </div>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-sm bg-[#1c1a17] border border-[#3d3830] text-sm font-bold text-[#a39c90] hover:text-amber-400 hover:border-amber-500/40 transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
