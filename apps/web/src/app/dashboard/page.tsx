"use client";

import Link from "next/link";

export default function Dashboard() {
  const stats = [
    { label: "Recursos Adquiridos", value: "0", icon: "🎁" },
    { label: "Descargas Totales", value: "0", icon: "📥" },
    { label: "Favoritos", value: "0", icon: "⭐" },
    { label: "Espacio Usado", value: "0GB", icon: "💾" },
  ];

  const recentDownloads: Array<{ id: number; name: string; date: string; size: string }> = [];

  const favoriteResources: Array<{ id: number; name: string; type: string; rating: number }> = [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="font-outfit text-4xl font-black text-[#e8e4db] mb-2">Bienvenido, Usuario</h1>
        <p className="text-[#8c8278]">Aquí puedes administrar tus recursos y descargas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-sm bg-[#1c1a17] border border-[#2d2a26] hover:border-amber-500/30 transition-all"
          >
            <div className="text-3xl mb-3">{stat.icon}</div>
            <div className="text-2xl font-black text-amber-400 mb-1">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Downloads */}
      <div className="bg-[#1c1a17] border border-[#2d2a26] rounded-sm p-6">
        <h2 className="font-outfit text-2xl font-bold text-[#e8e4db] mb-4">Descargas Recientes</h2>
        {recentDownloads.length > 0 ? (
          <div className="space-y-3">
            {recentDownloads.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-[#141311] rounded-sm border border-[#2d2a26] hover:border-amber-500/30 transition-all"
              >
                <div>
                  <div className="font-bold text-[#e8e4db]">{item.name}</div>
                  <div className="text-sm text-[#6b6459]">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#a39c90]">{item.size}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-[#3d3830] bg-[#141311] p-8 text-center">
            <p className="text-[#8c8278]">Todavía no tienes descargas.</p>
            <Link href="/plugins" className="mt-3 inline-block text-sm font-bold text-amber-400 hover:text-amber-300">
              Explorar marketplace
            </Link>
          </div>
        )}
      </div>

      {/* Favorite Resources */}
      <div className="bg-[#1c1a17] border border-[#2d2a26] rounded-sm p-6">
        <h2 className="font-outfit text-2xl font-bold text-[#e8e4db] mb-4">Recursos Favoritos</h2>
        {favoriteResources.length > 0 ? (
          <div className="space-y-3">
            {favoriteResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-4 bg-[#141311] rounded-sm border border-[#2d2a26] hover:border-amber-500/30 transition-all"
              >
                <div>
                  <div className="font-bold text-[#e8e4db]">{resource.name}</div>
                  <div className="text-sm text-[#6b6459]">{resource.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-400">★ {resource.rating}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-[#3d3830] bg-[#141311] p-8 text-center">
            <p className="text-[#8c8278]">No hay favoritos guardados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
