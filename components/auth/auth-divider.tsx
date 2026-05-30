export function AuthDivider({ label = "or continue with email" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3" role="separator">
      <div className="h-px flex-1 bg-border/30" aria-hidden="true" />
      <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/35">
        {label}
      </span>
      <div className="h-px flex-1 bg-border/30" aria-hidden="true" />
    </div>
  )
}
