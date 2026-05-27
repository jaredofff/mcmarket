"use client";

export default function Favorites() {
  const favorites = [
    {
      id: 1,
      name: "Advanced Economy",
      creator: "DevTeam",
      rating: 4.8,
      reviews: 245,
      price: 19.99,
      category: "Plugin",
    },
    {
      id: 2,
      name: "Server Config Pro",
      creator: "ConfigMaster",
      rating: 4.9,
      reviews: 189,
      price: 9.99,
      category: "Config",
    },
    {
      id: 3,
      name: "Lobby Design Ultimate",
      creator: "BuildGods",
      rating: 4.7,
      reviews: 156,
      price: 29.99,
      category: "Build",
    },
    {
      id: 4,
      name: "PvP Manager Elite",
      creator: "PvPTeam",
      rating: 4.6,
      reviews: 203,
      price: 14.99,
      category: "Plugin",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-3xl font-black text-[#e8e4db] mb-2">Favoritos</h1>
        <p className="text-[#8c8278]">Tus recursos guardados para comprar después</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map((resource) => (
          <div
            key={resource.id}
            className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-outfit font-bold text-lg text-[#e8e4db]">{resource.name}</h3>
                <p className="text-sm text-[#6b6459]">por {resource.creator}</p>
              </div>
              <button className="text-xl hover:scale-110 transition-transform">⭐</button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-bold text-amber-400">★ {resource.rating}</span>
              <span className="text-xs text-[#6b6459]">({resource.reviews} reseñas)</span>
            </div>

            <div className="py-3 border-t border-b border-[#2d2a26] mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">{resource.category}</span>
                <span className="text-xl font-black text-amber-400">${resource.price.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-sm bg-gradient-to-b from-amber-400 to-yellow-600 text-[#141311] font-black hover:brightness-110 transition-all shadow-[0_2px_0_#92400e]">
              Comprar Ahora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
