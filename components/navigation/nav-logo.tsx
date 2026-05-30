import Link from "next/link"
import { Mic2 } from "lucide-react"

export function NavLogo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="PodcastMatch AI — AI-powered podcast guest booking platform"
    >
      {/* Icon mark */}
      <span
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg
                   gradient-primary shadow-[var(--glow-subtle)]
                   transition-shadow duration-200 group-hover:shadow-[var(--glow-primary)]"
      >
        <Mic2 className="size-3.5 text-white" aria-hidden="true" />
      </span>

      {/* Wordmark */}
      <span className="text-sm font-bold tracking-tight text-foreground">
        PodcastMatch{" "}
        <span className="gradient-text-primary">AI</span>
      </span>
    </Link>
  )
}
