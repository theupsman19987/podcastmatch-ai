"use client"

import { useState } from "react"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

export interface AuthInputProps {
  label:        string
  id:           string
  type?:        "text" | "email" | "password"
  placeholder?: string
  value:        string
  onChange:     (value: string) => void
  error?:       string
  autoComplete?: string
  required?:    boolean
  disabled?:    boolean
}

export function AuthInput({
  label, id, type = "text", placeholder, value, onChange,
  error, autoComplete, required, disabled,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const resolvedType = type === "password" ? (showPassword ? "text" : "password") : type

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="ml-1 text-muted-foreground/35" aria-hidden="true">*</span>
        )}
      </label>

      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "w-full rounded-[var(--radius-md)] border bg-muted/15 backdrop-blur-sm",
            "px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/35",
            "outline-none transition-all duration-200",
            !error
              ? "border-border/40 focus:border-primary/50 focus:bg-muted/25 focus:shadow-[0_0_0_3px_oklch(0.58_0.22_255_/_0.10)]"
              : "border-red-500/50 bg-red-500/5 focus:border-red-400/70 focus:shadow-[0_0_0_3px_oklch(0.63_0.22_25_/_0.10)]",
            type === "password" && "pr-11",
            disabled && "cursor-not-allowed opacity-50",
          )}
        />

        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5
                       text-muted-foreground/40 transition-colors hover:text-muted-foreground
                       focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
          >
            {showPassword
              ? <EyeOff className="size-4" aria-hidden="true" />
              : <Eye    className="size-4" aria-hidden="true" />
            }
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            key={error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle className="size-3 flex-shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
