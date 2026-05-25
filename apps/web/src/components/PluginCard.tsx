import Link from "next/link";
import type { Plugin } from "@/lib/mockData";
import Image from "next/image";

interface PluginCardProps {
  plugin: Plugin;
}

const CATEGORY_COLORS: Record<string, string> = {
  Economy: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  RPG: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  Admin: "text-red-400 border-red-500/30 bg-red-500/10",
  Minigames: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  Mechanics: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  Social: "text-pink-400 border-pink-500/30 bg-pink-500/10",
  Skyblock: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  PvP: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  Building: "text-lime-400 border-lime-500/30 bg-lime-500/10",
  Utilities: "text-slate-400 border-slate-500/30 bg-slate-500/10",
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${
            i < full
              ? "text-amber-400"
              : i === full && half
              ? "text-amber-400/60"
              : "text-[#3d3830]"
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function PluginCard({ plugin }: PluginCardProps) {
  const categoryColor = CATEGORY_COLORS[plugin.category] ?? "text-amber-400 border-amber-500/30 bg-amber-500/10";

  return (
    <Link
      href={`/plugins/${plugin.slug}`}
      id={`plugin-card-${plugin.id}`}
      className="group relative rounded-sm bg-[#1c1a17] border border-[#2d2a26] overflow-hidden hover:border-amber-500/40 transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[4px_4px_0_rgba(245,158,11,0.15)]"
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#141311] border-b border-[#2d2a26] group-hover:border-amber-500/30 transition-colors">
        <Image
          src={plugin.image}
          alt={plugin.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-75 group-hover:opacity-95"
        />

        {/* Category Badge */}
        <div
          className={`absolute top-3 left-3 px-2 py-0.5 rounded-sm border text-xs font-bold uppercase tracking-widest backdrop-blur-md ${categoryColor}`}
        >
          {plugin.category}
        </div>

        {/* Free Badge */}
        {plugin.isFree && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-sm bg-emerald-500 text-[#0a1a10] text-xs font-black uppercase tracking-widest">
            Free
          </div>
        )}

        {/* Featured glow overlay */}
        {plugin.featured && (
          <div className="absolute inset-0 ring-2 ring-amber-500/20 rounded-sm pointer-events-none" />
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-outfit font-bold text-lg text-[#e8e4db] group-hover:text-amber-300 transition-colors leading-snug flex-1 truncate">
            {plugin.title}
          </h3>
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1 text-sm font-bold text-[#e8e4db]">
              <span className="text-amber-400">★</span>
              {plugin.rating.toFixed(1)}
            </div>
            <span className="text-xs text-[#6b6459]">({plugin.reviewCount})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#a39c90] leading-relaxed line-clamp-2 flex-1">
          {plugin.shortDescription}
        </p>

        {/* Creator */}
        <div className="flex items-center gap-2">
          <Image
            src={plugin.creator.avatar}
            alt={plugin.creator.username}
            width={20}
            height={20}
            className="rounded-sm border border-[#3d3830]"
          />
          <span className="text-xs text-[#6b6459] font-medium">{plugin.creator.username}</span>
          {plugin.creator.verified && (
            <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[#2d2a26] border-dashed" />

        {/* Price & Stats */}
        <div className="flex items-center justify-between">
          <div>
            {plugin.isFree ? (
              <span className="text-xl font-black text-emerald-400">FREE</span>
            ) : (
              <span className="text-xl font-black text-amber-400">${plugin.price.toFixed(2)}</span>
            )}
          </div>
          <div className="text-xs text-[#6b6459] font-bold uppercase tracking-wider">
            {plugin.isFree
              ? `${(plugin.downloads / 1000).toFixed(1)}k downloads`
              : `${plugin.sales >= 1000 ? (plugin.sales / 1000).toFixed(1) + "k" : plugin.sales} sales`}
          </div>
        </div>
      </div>
    </Link>
  );
}
