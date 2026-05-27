"use client";

export default function Activity() {
  const activities = [
    {
      id: 1,
      type: "Compra",
      title: "Compra completada",
      description: "Advanced Economy 2.5.1",
      date: "26/05/2024 14:32",
      icon: "💳",
      color: "emerald",
    },
    {
      id: 2,
      type: "Descarga",
      title: "Recurso descargado",
      description: "PvP Arena Manager v1.8.0",
      date: "25/05/2024 10:15",
      icon: "📥",
      color: "blue",
    },
    {
      id: 3,
      type: "Actualización",
      title: "Actualización disponible",
      description: "Premium Lobby Design v2.0.0",
      date: "23/05/2024 09:45",
      icon: "🔄",
      color: "amber",
    },
    {
      id: 4,
      type: "Reseña",
      title: "Reseña publicada",
      description: "Calificaste Advanced Economy con 5 estrellas",
      date: "22/05/2024 16:20",
      icon: "⭐",
      color: "yellow",
    },
    {
      id: 5,
      type: "Favorito",
      title: "Agregado a favoritos",
      description: "Server Config Pro",
      date: "20/05/2024 13:10",
      icon: "❤️",
      color: "red",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-3xl font-black text-[#e8e4db] mb-2">Actividad</h1>
        <p className="text-[#8c8278]">Tu historial de actividades recientes</p>
      </div>

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

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-2 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-[#a39c90] font-bold hover:border-amber-500/30 hover:text-amber-400 transition-all">
          Cargar más
        </button>
      </div>
    </div>
  );
}
