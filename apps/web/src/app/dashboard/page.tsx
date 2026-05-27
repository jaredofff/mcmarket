"use client";

export default function Dashboard() {
  const stats = [
    { label: "Recursos Adquiridos", value: "24", icon: "🎁" },
    { label: "Descargas Totales", value: "156", icon: "📥" },
    { label: "Favoritos", value: "12", icon: "⭐" },
    { label: "Espacio Usado", value: "2.4GB", icon: "💾" },
  ];

  const recentDownloads = [
    { id: 1, name: "Advanced Economy", date: "Hoy", size: "24MB" },
    { id: 2, name: "PvP Arena Manager", date: "Ayer", size: "18MB" },
    { id: 3, name: "Skyblock Config", date: "Hace 3 días", size: "45MB" },
  ];

  const favoriteResources = [
    { id: 1, name: "Advanced Economy", type: "Plugin", rating: 4.8 },
    { id: 2, name: "Server Config Pack", type: "Config", rating: 4.9 },
    { id: 3, name: "Premium Lobby Build", type: "Build", rating: 4.6 },
  ];

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
      </div>

      {/* Favorite Resources */}
      <div className="bg-[#1c1a17] border border-[#2d2a26] rounded-sm p-6">
        <h2 className="font-outfit text-2xl font-bold text-[#e8e4db] mb-4">Recursos Favoritos</h2>
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
      </div>
    </div>
  );
}
