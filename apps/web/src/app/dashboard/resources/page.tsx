"use client";

export default function Resources() {
  const resources = [
    {
      id: 1,
      name: "Advanced Economy",
      type: "Plugin",
      price: 19.99,
      purchaseDate: "15/05/2024",
      status: "Activo",
    },
    {
      id: 2,
      name: "Skyblock Config Pack",
      type: "Config",
      price: 9.99,
      purchaseDate: "10/05/2024",
      status: "Activo",
    },
    {
      id: 3,
      name: "Premium Lobby Build",
      type: "Build",
      price: 29.99,
      purchaseDate: "01/05/2024",
      status: "Actualización disponible",
    },
    {
      id: 4,
      name: "PvP Arena Manager",
      type: "Plugin",
      price: 14.99,
      purchaseDate: "25/04/2024",
      status: "Activo",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-3xl font-black text-[#e8e4db] mb-2">Mis Recursos</h1>
        <p className="text-[#8c8278]">Todos tus recursos adquiridos y sus licencias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-outfit font-bold text-lg text-[#e8e4db]">{resource.name}</h3>
                <p className="text-sm text-[#6b6459] mt-1">{resource.type}</p>
              </div>
              <span className="px-3 py-1 rounded-sm bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                {resource.status}
              </span>
            </div>

            <div className="space-y-2 py-4 border-t border-b border-[#2d2a26]">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b6459]">Precio:</span>
                <span className="font-bold text-amber-400">${resource.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b6459]">Comprado:</span>
                <span className="text-[#a39c90]">{resource.purchaseDate}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/20 transition-all">
                Detalles
              </button>
              <button className="flex-1 py-2 rounded-sm bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-500/20 transition-all">
                Soporte
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
