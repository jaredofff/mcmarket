"use client";

export default function Activity() {
  const activities: Array<{
    id: number;
    type: string;
    title: string;
    description: string;
    date: string;
    icon: string;
    color: string;
  }> = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-3xl font-black text-[#e8e4db] mb-2">Actividad</h1>
        <p className="text-[#8c8278]">Tu historial de actividades recientes</p>
      </div>

      {activities.length > 0 ? (
        <>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 bg-[#1c1a17] border border-[#2d2a26] rounded-sm hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-outfit font-bold text-[#e8e4db]">{activity.title}</h3>
                        <p className="text-sm text-[#8c8278] mt-1">{activity.description}</p>
                      </div>
                      <span className="text-xs text-[#6b6459] font-mono shrink-0">{activity.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="px-6 py-2 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-[#a39c90] font-bold hover:border-amber-500/30 hover:text-amber-400 transition-all">
              Cargar más
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-sm border border-dashed border-[#3d3830] bg-[#1c1a17] px-6 py-16 text-center">
          <h2 className="font-outfit text-xl font-bold text-[#e8e4db]">Sin actividad reciente</h2>
          <p className="mt-2 text-[#8c8278]">Las compras, descargas y favoritos reales se registrarán aquí.</p>
        </div>
      )}
    </div>
  );
}
