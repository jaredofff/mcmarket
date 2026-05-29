"use client";

export default function MembershipPage() {
  const plans = [
    {
      icon: "🛡️",
      name: "VIPZONE",
      price: 6.0,
      badge: "Popular",
      features: [
        { icon: "⚙️", text: "Configuraciones premium actualizadas" },
        { icon: "🗺️", text: "Setups exclusivos y mapas premium" },
        { icon: "🔌", text: "Plugins y contenido 100% original" },
        { icon: "🔐", text: "Acceso privado a contenido oculto" },
        { icon: "🔄", text: "Actualizaciones nuevas y constantes" },
      ],
      highlighted: false,
    },
    {
      icon: "🔱",
      name: "ZONELEGEND",
      price: 11.0,
      badge: "Recomendado",
      features: [
        { icon: "⭐", text: "¡INCLUYE ABSOLUTAMENTE TODO LO DE VIPZONE!" },
        { icon: "🌐", text: "Páginas web premium y bots exclusivos" },
        { icon: "🛠️", text: "Configs y plugins totalmente personalizados" },
        { icon: "📦", text: "Modelos especiales 3D actualizados" },
        { icon: "👹", text: "Bosses custom y mecánicas avanzadas" },
        { icon: "⚔️", text: "Equipamiento único: Armas y armaduras" },
        { icon: "🔮", text: "Objetos mágicos y sistemas exclusivos" },
      ],
      highlighted: true,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative w-full pt-28 pb-20 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute top-[-10%] left-[50%] translate-x-[-50%] w-175 h-100 rounded-full bg-amber-600/8 blur-[140px] pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] w-125 h-75 rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#1c1a17] border border-[#3d3830] text-xs font-bold text-amber-400 mb-8 uppercase tracking-widest shadow-inner">
            <span className="flex h-2 w-2 rounded-none bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
            Planes de Membresía
          </div>

          <h1 className="font-outfit text-5xl md:text-6xl font-black tracking-tight text-[#e8e4db] max-w-4xl leading-[1.05] mb-6">
            Elige tu
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-amber-300 via-yellow-400 to-amber-600">
              plan perfecto
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#8c8278] max-w-2xl font-medium leading-relaxed">
            Acceso ilimitado a recursos premium, actualizaciones constantes y contenido exclusivo
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-sm overflow-hidden transition-all ${
                plan.highlighted
                  ? "bg-linear-to-br from-purple-900/20 via-[#1c1a17] to-[#1c1a17] border-2 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                  : "bg-[#1c1a17] border border-[#2d2a26]"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0">
                  <div className={`px-4 py-2 rounded-bl-sm font-black text-xs uppercase tracking-widest ${
                    plan.highlighted
                      ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-amber-500 text-[#141311]"
                  }`}>
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="text-5xl mb-3">{plan.icon}</div>
                  <h2 className="font-outfit text-3xl font-black text-[#e8e4db] mb-2">{plan.name}</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-yellow-400">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span className="text-[#6b6459] font-bold">/mes</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="text-xl shrink-0 mt-0.5">{feature.icon}</div>
                      <p className="text-sm text-[#a39c90] leading-relaxed">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full h-14 rounded-sm font-black text-lg transition-all ${
                    plan.highlighted
                      ? "bg-linear-to-b from-purple-500 to-pink-600 text-white hover:brightness-110 shadow-[0_4px_0_#6b21a8]"
                      : "bg-linear-to-b from-amber-400 to-yellow-600 text-[#141311] hover:brightness-110 shadow-[0_4px_0_#92400e]"
                  }`}
                >
                  Obtener {plan.name}
                </button>

                {/* Info Text */}
                <p className="text-xs text-[#6b6459] text-center mt-4">
                  Sin compromiso • Cancela cuando quieras
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="font-outfit text-3xl font-black text-[#e8e4db] mb-3">Preguntas Frecuentes</h2>
          <p className="text-[#8c8278]">Resolvemos tus dudas sobre nuestros planes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: "¿Puedo cambiar de plan?", a: "Sí, puedes actualizar a ZONELEGEND en cualquier momento." },
            { q: "¿Qué incluye 'sin compromiso'?", a: "Puedes cancelar tu membresía cuando quieras sin penalización." },
            { q: "¿Con qué frecuencia se actualizan?", a: "Nuevos recursos se añaden constantemente, cada semana." },
            { q: "¿Acceso a todo el contenido?", a: "ZONELEGEND incluye todo lo de VIPZONE + contenido adicional exclusivo." },
          ].map((faq, idx) => (
            <div key={idx} className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm hover:border-amber-500/30 transition-all">
              <h3 className="font-bold text-[#e8e4db] mb-2">{faq.q}</h3>
              <p className="text-sm text-[#8c8278]">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
