import Link from "next/link";
import PluginCard from "@/components/PluginCard";
import { MOCK_PLUGINS, CATEGORIES } from "@/lib/mockData";

export default function Home() {
  const featuredPlugins = MOCK_PLUGINS.filter((p) => p.featured).slice(0, 3);
  const trendingPlugins = MOCK_PLUGINS.sort((a, b) => b.sales - a.sales).slice(0, 6);

  const stats = [
    { label: "Plugins", value: "1,400+" },
    { label: "Verified Creators", value: "320+" },
    { label: "Downloads", value: "2.4M+" },
    { label: "Happy Servers", value: "58k+" },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative w-full pt-28 pb-24 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Glow effects */}
        <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-[700px] h-[400px] rounded-full bg-amber-600/8 blur-[140px] pointer-events-none" />
        <div className="absolute top-[30%] left-[15%] w-[300px] h-[300px] rounded-full bg-yellow-700/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#1c1a17] border border-[#3d3830] text-xs font-bold text-amber-400 mb-8 uppercase tracking-widest shadow-inner">
            <span className="flex h-2 w-2 rounded-none bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
            Over 1,400 plugins available now
          </div>

          <h1 className="font-outfit text-5xl md:text-7xl font-black tracking-tight text-[#e8e4db] max-w-4xl leading-[1.05] mb-6">
            Elevate your server with{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600">
              premium resources
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#8c8278] max-w-2xl mb-10 font-medium leading-relaxed">
            Discover the highest quality plugins built by verified developers.
            Transform your Minecraft network into an unforgettable experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
            <Link
              href="/plugins"
              id="hero-browse-plugins"
              className="h-14 px-10 rounded-sm bg-gradient-to-b from-amber-400 to-yellow-600 text-[#141311] font-black text-lg hover:brightness-110 transition-all shadow-[0_4px_0_#92400e,inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[0_0px_0_#92400e] active:translate-y-1 flex items-center justify-center gap-2"
            >
              Browse Plugins
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </Link>
            <Link
              href="#"
              id="hero-become-creator"
              className="h-14 px-10 rounded-sm bg-[#1c1a17] border border-[#3d3830] border-b-2 border-b-black text-[#e8e4db] font-black text-lg hover:bg-[#242118] hover:border-amber-500/30 transition-all flex items-center justify-center"
            >
              Become a Creator
            </Link>
          </div>

          {/* Stats bar */}
          <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2d2a26] rounded-sm overflow-hidden border border-[#2d2a26]">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#1c1a17] px-6 py-4 text-center">
                <div className="font-outfit font-black text-2xl text-amber-400">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#6b6459] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Plugins ─────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8 border-b border-[#2d2a26] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Editor&apos;s Pick</p>
            <h2 className="font-outfit text-3xl font-black text-[#e8e4db]">Featured Resources</h2>
          </div>
          <Link href="/plugins?sort=featured" className="text-sm font-bold text-[#6b6459] hover:text-amber-400 transition-colors flex items-center gap-1 group uppercase tracking-wider">
            View all <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
          </Link>
        </div>

        {/* Featured: 1 large + 2 small */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Large featured card */}
          <Link
            href={`/plugins/${featuredPlugins[0].slug}`}
            className="group relative rounded-sm bg-[#1c1a17] border border-[#2d2a26] overflow-hidden hover:border-amber-500/40 transition-all cursor-pointer shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[4px_4px_0_rgba(245,158,11,0.15)] hover:-translate-y-1"
          >
            <div className="relative aspect-[16/7] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredPlugins[0].image}
                alt={featuredPlugins[0].title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a17] via-[#1c1a17]/40 to-transparent" />
              <div className="absolute top-4 left-4 px-2 py-0.5 rounded-sm bg-amber-500 text-[#141311] text-xs font-black uppercase tracking-widest">
                Featured
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-outfit font-black text-2xl text-[#e8e4db] group-hover:text-amber-300 transition-colors">
                  {featuredPlugins[0].title}
                </h3>
                <span className="text-2xl font-black text-amber-400 shrink-0">
                  ${featuredPlugins[0].price.toFixed(2)}
                </span>
              </div>
              <p className="text-[#8c8278] leading-relaxed">{featuredPlugins[0].shortDescription}</p>
            </div>
          </Link>

          {/* 2 smaller cards stacked */}
          <div className="flex flex-col gap-6">
            {featuredPlugins.slice(1, 3).map((p) => (
              <Link
                key={p.id}
                href={`/plugins/${p.slug}`}
                className="group flex rounded-sm bg-[#1c1a17] border border-[#2d2a26] overflow-hidden hover:border-amber-500/40 transition-all cursor-pointer shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[4px_4px_0_rgba(245,158,11,0.15)] hover:-translate-y-0.5 flex-1"
              >
                <div className="relative w-40 shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1c1a17]/60" />
                </div>
                <div className="p-4 flex flex-col justify-center gap-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{p.category}</span>
                  <h3 className="font-outfit font-bold text-lg text-[#e8e4db] group-hover:text-amber-300 transition-colors">{p.title}</h3>
                  <p className="text-sm text-[#6b6459] line-clamp-1">{p.shortDescription}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-black text-amber-400">${p.price.toFixed(2)}</span>
                    <span className="text-xs text-[#4a4540]">★ {p.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Browser ─────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Browse by type</p>
          <h2 className="font-outfit text-3xl font-black text-[#e8e4db]">Categories</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/plugins?category=${cat}`}
              className="px-4 py-2 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-sm font-bold text-[#a39c90] hover:text-amber-400 hover:border-amber-500/40 transition-all uppercase tracking-wider shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0_rgba(245,158,11,0.1)] hover:-translate-y-0.5"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending Plugins Grid ─────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-8 border-b border-[#2d2a26] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">This Week</p>
            <h2 className="font-outfit text-3xl font-black text-[#e8e4db]">Trending Resources</h2>
          </div>
          <Link href="/plugins?sort=trending" className="text-sm font-bold text-[#6b6459] hover:text-amber-400 transition-colors flex items-center gap-1 group uppercase tracking-wider">
            View all <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPlugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="relative rounded-sm bg-gradient-to-r from-[#1c1a17] via-[#23201c] to-[#1c1a17] border border-[#3d3830] p-10 md:p-16 overflow-hidden text-center">
          <div className="absolute top-[-50%] left-[50%] translate-x-[-50%] w-[500px] h-[300px] rounded-full bg-amber-600/10 blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-outfit text-4xl md:text-5xl font-black text-[#e8e4db] mb-4">
              Ready to start selling?
            </h2>
            <p className="text-[#8c8278] text-lg max-w-xl mx-auto mb-8">
              Join hundreds of verified creators earning on the most trusted Minecraft marketplace. Set your price, keep 90% of earnings.
            </p>
            <Link
              href="#"
              id="cta-become-creator"
              className="inline-flex h-14 px-10 rounded-sm bg-gradient-to-b from-amber-400 to-yellow-600 text-[#141311] font-black text-lg hover:brightness-110 transition-all shadow-[0_4px_0_#92400e,inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[0_0px_0_#92400e] active:translate-y-1 items-center gap-2"
            >
              Apply as Creator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
