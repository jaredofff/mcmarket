export default function HeroBanner() {
  return (
    <>
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover -z-20"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{ imageRendering: "pixelated" }}
      >
        <source src="/background.webm" type="video/webm" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-[#141311] -z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-[#141311] via-[#141311]/70 to-transparent" />
    </>
  );
}
