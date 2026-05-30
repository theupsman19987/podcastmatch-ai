/* server component — no animations, pure CSS */

/* ═══════════════════════════════════════════════════════════
   AIDashboardAtmosphere — ambient visual layer behind content.
   Provides cinematic depth without competing with widgets.
   Pure CSS: no JS, no hydration cost.
   ═══════════════════════════════════════════════════════════ */

export function AIDashboardAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Primary orb — upper-right, electric blue */}
      <div
        className="absolute -right-64 -top-64 h-[700px] w-[700px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, oklch(0.58 0.220 255) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Secondary orb — lower-left, cyan */}
      <div
        className="absolute -bottom-48 -left-48 h-[600px] w-[600px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, oklch(0.70 0.160 200) 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />

      {/* Accent orb — center-right, gold */}
      <div
        className="absolute right-[20%] top-[40%] h-[300px] w-[300px] rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, oklch(0.78 0.150 83) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* Subtle dot grid — whole panel */}
      <div
        className="absolute inset-0 opacity-[0.40]"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.96 0 0 / 0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top-fade vignette — helps topbar feel lifted */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background: "linear-gradient(to bottom, oklch(0.08 0.025 255 / 0.6), transparent)",
        }}
      />
    </div>
  )
}
