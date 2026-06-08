export default function HeroBanner() {
  return (
    <section className="relative isolate flex h-[450px] w-full items-center justify-center overflow-hidden px-4 text-center sm:h-[50vh] sm:min-h-[450px]">
      <video
        className="absolute inset-0 h-full w-full object-cover -z-20"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{ imageRendering: "pixelated" }}
      >
        <source src="/background.webm" type="video/webm" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-zinc-950 -z-10" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <span className="mb-5 inline-flex items-center border border-amber-400/30 bg-black/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.18)] backdrop-blur-sm">
          Plataforma Premium
        </span>

        <h1 className="font-outfit text-5xl font-black uppercase leading-none text-[#f5efe4] drop-shadow-[0_5px_0_rgba(0,0,0,0.45)] sm:text-7xl md:text-8xl">
          MC Market
        </h1>

        <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-zinc-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-lg">
          Recursos, plugins y setups premium para crear servidores de Minecraft más potentes, visuales y listos para crecer.
        </p>
      </div>
    </section>
  );
}
