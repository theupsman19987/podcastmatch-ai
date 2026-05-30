"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Search, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDiscovery } from "@/components/discovery/discovery-context"

const SUGGESTIONS = [
  "Leadership Podcasts",
  "Mindset Shows",
  "Faith Based Podcasts",
  "Business Growth Interviews",
  "Recovery Stories",
  "Tech Founders",
  "Women in Leadership",
  "Entrepreneurship",
]

/* ═══════════════════════════════════════════════════════════
   DiscoverySearchBar — the AI-powered search experience.
   Animated focus ring, suggestion chips, AI scanning state.
   ═══════════════════════════════════════════════════════════ */
export function DiscoverySearchBar() {
  const { query, setQuery, isSearching } = useDiscovery()
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const showSuggestions = focused && !query

  return (
    <div className="flex flex-col gap-3">

      {/* ── Search input ────────────────────────────────── */}
      <div className="relative">
        {/* Glow ring — expands on focus */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[var(--radius-2xl)]",
            "transition-all duration-300",
            focused
              ? "shadow-[0_0_0_3px_oklch(0.58_0.220_255/0.18),0_0_32px_oklch(0.58_0.220_255/0.12)]"
              : "shadow-none"
          )}
        />

        {/* Search icon / AI spinner */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="spinner"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Sparkles
                  className="size-5 text-primary animate-pulse"
                  aria-hidden="true"
                />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Search
                  className={cn(
                    "size-5 transition-colors duration-200",
                    focused ? "text-primary" : "text-muted-foreground/50"
                  )}
                  aria-hidden="true"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search podcasts by topic, host, or niche…"
          aria-label="Search podcasts"
          className={cn(
            "h-14 w-full rounded-[var(--radius-2xl)] border bg-card",
            "pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground/40",
            "outline-none transition-all duration-250",
            focused
              ? "border-primary/40 bg-card/90"
              : "border-border/60 hover:border-border"
          )}
        />

        {/* Right side: AI badge / clear button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 rounded-full border border-[oklch(0.70_0.16_200/0.25)]
                           bg-[oklch(0.70_0.16_200/0.08)] px-2.5 py-1"
                aria-live="polite"
                aria-label="AI scanning"
              >
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--premium-cyan)] opacity-60" aria-hidden="true" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--premium-cyan)]" aria-hidden="true" />
                </span>
                <span className="text-[10px] font-semibold text-[var(--premium-cyan)]">AI Scanning</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {query && !isSearching && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => { setQuery(""); inputRef.current?.focus() }}
                aria-label="Clear search"
                className="flex h-7 w-7 items-center justify-center rounded-full
                           text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Suggestion chips ────────────────────────────── */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Search suggestions"
          >
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60 mr-1">
              <Sparkles className="size-3" aria-hidden="true" /> Try:
            </span>
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                role="listitem"
                onMouseDown={e => { e.preventDefault(); setQuery(s) }}
                className="rounded-full border border-border/50 bg-muted/30 px-3 py-1
                           text-[11px] font-medium text-muted-foreground
                           transition-all duration-150
                           hover:border-primary/30 hover:bg-primary/8 hover:text-foreground"
              >
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
