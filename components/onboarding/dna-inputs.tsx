"use client"

import { type ReactNode } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function StepCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] p-6 md:p-8 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      {children}
    </div>
  )
}

export function StepHeader({ headline, sub }: { headline: string; sub?: string }) {
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug">{headline}</h2>
      {sub && <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{sub}</p>}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
      {children}
    </p>
  )
}

interface SelectionCardProps {
  emoji?: string
  label: string
  description?: string
  selected: boolean
  onClick: () => void
}

export function SelectionCard({ emoji, label, description, selected, onClick }: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full text-left p-4 rounded-xl border transition-all duration-200",
        "bg-card/50 backdrop-blur-sm",
        selected
          ? "border-primary/60 bg-primary/5 shadow-[0_0_16px_oklch(var(--primary)/0.12)]"
          : "border-border/40 hover:border-border/70 hover:bg-card/70"
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
      <div className="flex items-start gap-3">
        {emoji && (
          <span className="text-xl leading-none mt-0.5 shrink-0">{emoji}</span>
        )}
        <div className="min-w-0 pr-6">
          <p className={cn("text-sm font-semibold leading-snug", selected ? "text-foreground" : "text-foreground/80")}>
            {label}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </button>
  )
}

interface MultiCardProps {
  emoji?: string
  label: string
  description?: string
  selected: boolean
  onClick: () => void
}

export function MultiCard({ emoji, label, description, selected, onClick }: MultiCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full text-left p-4 rounded-xl border transition-all duration-200",
        "bg-card/50 backdrop-blur-sm",
        selected
          ? "border-primary/60 bg-primary/5 shadow-[0_0_16px_oklch(var(--primary)/0.12)]"
          : "border-border/40 hover:border-border/70 hover:bg-card/70"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex items-center justify-center w-5 h-5 rounded mt-0.5 shrink-0 border-2 transition-all duration-200",
          selected ? "bg-primary border-primary" : "border-border/50 bg-transparent"
        )}>
          {selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
        </div>
        {emoji && <span className="text-lg leading-none mt-0.5 shrink-0">{emoji}</span>}
        <div className="min-w-0">
          <p className={cn("text-sm font-semibold leading-snug", selected ? "text-foreground" : "text-foreground/80")}>
            {label}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </button>
  )
}

interface TagPillProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function TagPill({ label, selected, onClick }: TagPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap",
        selected
          ? "bg-primary/15 border-primary/50 text-primary shadow-[0_0_8px_oklch(var(--primary)/0.15)]"
          : "bg-card/50 border-border/40 text-muted-foreground hover:border-border/70 hover:text-foreground/80"
      )}
    >
      {selected && <span className="mr-1 text-xs">✓</span>}
      {label}
    </button>
  )
}

interface StepTextareaProps {
  value: string
  onChange: (v: string) => void
  placeholder: string
  rows?: number
  wordLimit?: number
}

function countWords(s: string) {
  return s.trim() === "" ? 0 : s.trim().split(/\s+/).length
}

export function StepTextarea({ value, onChange, placeholder, rows = 4, wordLimit = 400 }: StepTextareaProps) {
  const words = countWords(value)
  const over  = words > wordLimit

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value
    if (countWords(next) <= wordLimit) onChange(next)
  }

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full resize-none rounded-xl border bg-card/50 backdrop-blur-sm",
          "px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60",
          "focus:outline-none focus:ring-1 transition-all duration-200 leading-relaxed",
          over
            ? "border-destructive/60 focus:border-destructive/80 focus:ring-destructive/20"
            : "border-border/40 focus:border-primary/50 focus:ring-primary/20"
        )}
      />
      <span className={cn(
        "absolute bottom-3 right-4 text-xs",
        over ? "text-destructive" : "text-muted-foreground/50"
      )}>
        {words}/{wordLimit} words
      </span>
    </div>
  )
}

interface StepNavProps {
  onBack?: () => void
  onNext: () => void
  isLast?: boolean
  canNext: boolean
}

export function StepNav({ onBack, onNext, isLast, canNext }: StepNavProps) {
  return (
    <div className="flex items-center justify-between pt-6 mt-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/30"
        >
          ← Back
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
          canNext
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(var(--primary)/0.3)] hover:shadow-[0_0_28px_oklch(var(--primary)/0.4)]"
            : "bg-muted/40 text-muted-foreground cursor-not-allowed"
        )}
      >
        {isLast ? "Generate My Profile" : "Continue"} →
      </button>
    </div>
  )
}
