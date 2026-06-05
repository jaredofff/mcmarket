import { Crown, Gem, Infinity, Sparkles, Zap } from "lucide-react";

const ranks = [
  {
    id: "vip",
    name: "VIPZONE",
    price: "$6.00",
    badge: "Popular",
    description: "Acceso ilimitado a recursos premium, actualizaciones constantes y contenido exclusivo.",
    icon: Gem,
    accent: "text-amber-300",
    badgeClass: "border-amber-500/25 bg-amber-500/10 text-amber-300",
    border: "border-[#2d2a26] hover:border-amber-500/40",
    glow: "shadow-[4px_4px_0_rgba(0,0,0,0.28)]",
    perks: [
      "Configuraciones premium actualizadas",
      "Setups exclusivos y mapas premium",
      "Plugins y contenido 100% original",
      "Acceso privado a contenido oculto",
      "Actualizaciones nuevas y constantes",
    ],
  },
  {
    id: "legend",
    name: "ZONELEGEND",
    price: "$11.00",
    badge: "Recomendado",
    description: "El plan definitivo con acceso prioritario y sin restricciones a recursos premium exclusivos.",
    icon: Crown,
    accent: "text-purple-300",
    badgeClass: "border-purple-400/30 bg-purple-500/15 text-purple-200",
    border: "border-purple-500/45 hover:border-purple-400/70",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.18)]",
    perks: [
      "INCLUYE ABSOLUTAMENTE TODO LO DE VIPZONE",
      "Páginas web premium y bots exclusivos",
      "Configs y plugins totalmente personalizados",
      "Modelos especiales 3D actualizados",
      "Bosses custom y mecánicas avanzadas",
      "Equipamiento único: Armas y armaduras",
      "Objetos mágicos y sistemas exclusivos",
    ],
  },
];

const galleryImages = [
  { id: "logo", label: "MC Market", image: "/logo.png" },
  { id: "harlex", label: "Harlex", image: "/community-creators/harlex.png" },
  { id: "onze", label: "Onze", image: "/community-creators/onze.png" },
  { id: "plugins", label: "Plugins", image: "/logo.png" },
  { id: "setups", label: "Setups", image: "/logo.png" },
  { id: "resources", label: "Recursos premium", image: "/community-creators/onze.png" },
];

export default function MinecraftRanksShowcase() {
  const marqueeImages = [...galleryImages, ...galleryImages];

  return (
    <section className="relative z-20 w-full isolate bg-transparent">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ranks.map((rank) => {
            const Icon = rank.icon;

            return (
              <article
                key={rank.id}
                className={`group relative overflow-hidden rounded-sm border bg-[#1c1a17]/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 ${rank.border} ${rank.glow}`}
              >
                <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-3 text-white/80 transition-colors duration-300 group-hover:bg-white/10">
                  <Icon className={`size-6 ${rank.accent}`} />
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-300">
                    <Infinity className="size-4" />
                    Pago único de por vida
                  </div>
                  <div className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-black uppercase tracking-widest ${rank.badgeClass}`}>
                    {rank.badge}
                  </div>
                </div>

                <div className="pr-16">
                  <p className={`mb-2 text-sm font-black uppercase tracking-[0.24em] ${rank.accent}`}>
                    Membresía {rank.name}
                  </p>
                  <h2 className="font-outfit text-4xl font-black leading-none text-white sm:text-5xl">
                    {rank.name}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8c8278]">
                    {rank.description}
                  </p>
                </div>

                <div className="mt-8 flex items-end justify-between gap-4 border-t border-[#2d2a26] pt-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                      Un solo pago
                    </p>
                    <p className="mt-1 text-3xl font-black text-white">{rank.price}</p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-sm border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm font-black text-amber-300">
                    <Zap className="size-4 fill-amber-300 text-amber-300" />
                    Sin suscripción
                  </div>
                </div>

                <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {rank.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-center gap-2 rounded-sm border border-[#2d2a26] bg-black/10 px-3 py-2 text-sm font-semibold text-[#a39c90]"
                    >
                      <Sparkles className={`size-4 shrink-0 ${rank.accent}`} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="mt-10 overflow-hidden">
          <div className="flex w-max gap-4 [animation:minecraft-ranks-marquee_34s_linear_infinite] hover:[animation-play-state:paused]">
            {marqueeImages.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="relative aspect-video w-64 shrink-0 overflow-hidden rounded-sm border border-[#2d2a26] bg-[#1c1a17]/70 backdrop-blur sm:w-80"
              >
                <div
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-90"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/35 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-white/85 backdrop-blur">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes minecraft-ranks-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }
      `}</style>
    </section>
  );
}
