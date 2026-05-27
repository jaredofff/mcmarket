"use client";

export default function Downloads() {
  const downloads = [
    {
      id: 1,
      name: "Advanced Economy",
      category: "Plugin",
      size: "24MB",
      date: "26/05/2024",
      version: "2.5.1",
    },
    {
      id: 2,
      name: "PvP Arena Manager",
      category: "Plugin",
      size: "18MB",
      date: "25/05/2024",
      version: "1.8.0",
    },
    {
      id: 3,
      name: "Skyblock Configuration",
      category: "Config",
      size: "45MB",
      date: "23/05/2024",
      version: "3.2.1",
    },
    {
      id: 4,
      name: "Premium Lobby Design",
      category: "Build",
      size: "156MB",
      date: "20/05/2024",
      version: "1.0.0",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-3xl font-black text-[#e8e4db] mb-2">Mis Descargas</h1>
        <p className="text-[#8c8278]">Todos tus recursos descargados</p>
      </div>

      <div className="bg-[#1c1a17] border border-[#2d2a26] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d2a26] bg-[#141311]">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                  Recurso
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                  Versión
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                  Tamaño
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((item) => (
                <tr key={item.id} className="border-b border-[#2d2a26] hover:bg-[#1c1a17] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#e8e4db]">{item.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#a39c90]">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-amber-400">{item.version}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#a39c90]">{item.size}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#6b6459]">{item.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors">
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
