"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"

// ─── SettingsCard ─────────────────────────────────────────────────────────────

interface CardProps { children: React.ReactNode; className?: string; delay?: number }

export function SettingsCard({ children, className = "", delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      {children}
    </motion.div>
  )
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

interface HeaderProps { icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode }

export function SectionHeader({ icon, title, description, action }: HeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider() {
  return <div className="h-px w-full bg-border/30 my-5" />
}

// ─── FieldRow ────────────────────────────────────────────────────────────────

interface FieldRowProps { label: string; hint?: string; children: React.ReactNode }

export function FieldRow({ label, hint, children }: FieldRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 py-4 border-b border-border/20 last:border-0">
      <div className="sm:w-40 shrink-0 pt-0.5">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        {hint && <p className="text-[10px] text-muted-foreground/70 mt-1 leading-snug">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

// ─── TextInput ────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function TextInput(props: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2 rounded-xl bg-card/60 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:bg-card/80 transition-colors duration-150 ${props.className ?? ""}`}
    />
  )
}

// ─── TextArea ────────────────────────────────────────────────────────────────

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea(props: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl bg-card/60 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:bg-card/80 transition-colors duration-150 resize-none ${props.className ?? ""}`}
    />
  )
}

// ─── Toggle ──────────────────────────────────────────────────────────────────

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
        checked ? "bg-primary" : "bg-border/50"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <motion.span
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        animate={{ x: checked ? 23 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

interface ChipProps { label: string; active: boolean; onToggle: () => void }

export function Chip({ label, active, onToggle }: ChipProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
        active
          ? "bg-primary/15 border-primary/40 text-primary"
          : "bg-card/40 border-border/40 text-muted-foreground hover:border-primary/25 hover:text-foreground"
      }`}
    >
      {active && <Check className="w-3 h-3 shrink-0" />}
      {label}
    </button>
  )
}

// ─── SaveButton ──────────────────────────────────────────────────────────────

export type SaveState = "idle" | "saving" | "saved"

interface SaveButtonProps { state: SaveState; onClick: () => void }

export function SaveButton({ state, onClick }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={state !== "idle"}
      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
        state === "saved"
          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
          : state === "saving"
          ? "bg-primary/10 border-primary/30 text-primary opacity-70 cursor-wait"
          : "bg-primary/15 border-primary/40 text-primary hover:bg-primary/25 hover:border-primary/60"
      }`}
    >
      {state === "saved" ? "✓ Saved" : state === "saving" ? "Saving…" : "Save Changes"}
    </button>
  )
}
