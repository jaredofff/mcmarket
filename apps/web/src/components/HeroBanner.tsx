export default function HeroBanner() {
  return (
    <>
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
    </>
  );
}
