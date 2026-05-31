/* Loading skeleton for /dashboard/matches */
export default function MatchesLoading() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8 max-w-screen-xl mx-auto w-full animate-pulse">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="h-7 w-64 rounded-full bg-muted/40" />
        <div className="h-4 w-96 rounded-full bg-muted/30" />
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-[var(--radius-xl)] border border-border/40 bg-card/40" />
        ))}
      </div>

      {/* Top matches */}
      <div className="flex flex-col gap-3">
        <div className="h-5 w-32 rounded-full bg-muted/40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-[var(--radius-xl)] border border-border/40 bg-card/40" />
        ))}
      </div>
    </div>
  )
}
