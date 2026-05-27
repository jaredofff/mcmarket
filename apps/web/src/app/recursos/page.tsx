"use client";

import Link from "next/link";

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

export default function ResourcesPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative w-full pt-28 pb-16 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-[600px] h-[300px] rounded-full bg-amber-600/8 blur-[140px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
          <h1 className="font-outfit text-5xl md:text-6xl font-black tracking-tight text-[#e8e4db] mb-4">
            Explora Todas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600">
              nuestras Categorías
            </span>
          </h1>
          <p className="text-lg text-[#8c8278] max-w-2xl leading-relaxed">
            Descubre setups, configuraciones, builds y webs premium para llevar tu servidor al siguiente nivel.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative p-8 rounded-sm bg-[#1c1a17] border border-[#2d2a26] hover:border-amber-500/40 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] cursor-pointer overflow-hidden"
            >
              {/* Background effect */}
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

      {/* CTA Section */}
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
    </div>
  );
}
