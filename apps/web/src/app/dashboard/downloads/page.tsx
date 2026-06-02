"use client";

export default function Downloads() {
  const downloads: Array<{
    id: number;
    name: string;
    category: string;
    size: string;
    date: string;
    version: string;
  }> = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-3xl font-black text-[#e8e4db] mb-2">Mis Descargas</h1>
        <p className="text-[#8c8278]">Todos tus recursos descargados</p>
      </div>

      {downloads.length > 0 ? (
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
      ) : (
        <div className="rounded-sm border border-dashed border-[#3d3830] bg-[#1c1a17] px-6 py-16 text-center">
          <h2 className="font-outfit text-xl font-bold text-[#e8e4db]">No hay descargas todavía</h2>
          <p className="mt-2 text-[#8c8278]">Cuando compres o descargues recursos reales, aparecerán en esta tabla.</p>
        </div>
      )}
    </div>
  );
}
