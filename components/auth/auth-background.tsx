export function AuthBackground() {
  return (
    <div className="pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 -z-20 hero-grid opacity-[0.35]" />

      {/* Primary blue orb */}
      <div
        className="absolute -top-48 left-1/2 -z-10 h-[700px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.11), transparent 65%)" }}
      />

      {/* Cyan orb — right edge */}
      <div
        className="absolute top-1/3 -right-32 -z-10 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.07), transparent 65%)" }}
      />

      {/* Gold accent — bottom left */}
      <div
        className="absolute -bottom-32 -left-32 -z-10 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.05), transparent 65%)" }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, oklch(0.06 0.02 255 / 0.55) 100%)" }}
      />
    </div>
  )
}
