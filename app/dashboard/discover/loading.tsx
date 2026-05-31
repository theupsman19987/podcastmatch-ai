/* Loading skeleton for /dashboard/discover */
export default function DiscoverLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-6 md:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full animate-pulse">

      {/* Search bar skeleton */}
      <div className="h-11 w-full rounded-[var(--radius-xl)] bg-muted/40" />

      {/* Controls row */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-24 rounded-[var(--radius-md)] bg-muted/40" />
        <div className="h-4 w-32 rounded-full bg-muted/30" />
        <div className="flex-1" />
        <div className="h-8 w-28 rounded-[var(--radius-md)] bg-muted/40" />
        <div className="h-8 w-16 rounded-[var(--radius-md)] bg-muted/40" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border/40 bg-card/40"
          >
            <div className="h-36 w-full bg-muted/40" />
            <div className="flex flex-col gap-3 p-4">
              <div className="h-3.5 w-3/4 rounded-full bg-muted/40" />
              <div className="h-2.5 w-1/2 rounded-full bg-muted/30" />
              <div className="h-2 w-full rounded-full bg-muted/20" />
              <div className="h-2 w-5/6 rounded-full bg-muted/20" />
              <div className="flex gap-1.5 mt-1">
                <div className="h-4 w-16 rounded-md bg-muted/30" />
                <div className="h-4 w-20 rounded-md bg-muted/30" />
              </div>
              <div className="flex justify-between pt-1 border-t border-border/20">
                <div className="h-6 w-14 rounded-md bg-muted/30" />
                <div className="h-6 w-16 rounded-md bg-muted/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
