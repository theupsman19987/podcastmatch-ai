"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MessageSquare, X, Bug, Lightbulb, MessageCircle, Send, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

type FeedbackType = "bug" | "feature" | "general"

const TYPES: { id: FeedbackType; icon: typeof Bug; label: string; hint: string }[] = [
  { id: "bug",     icon: Bug,           label: "Bug Report",   hint: "Something isn't working as expected" },
  { id: "feature", icon: Lightbulb,     label: "Feature Idea", hint: "Suggest an improvement or new feature" },
  { id: "general", icon: MessageCircle, label: "General",      hint: "Any other feedback or question" },
]

export function FeedbackWidget() {
  const [open,      setOpen]      = useState(false)
  const [type,      setType]      = useState<FeedbackType>("general")
  const [message,   setMessage]   = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const pathname = usePathname()

  /* Reset when closed */
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setMessage("")
        setSuccess(false)
        setError(null)
        setType("general")
      }, 350)
      return () => clearTimeout(t)
    }
  }, [open])

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    if (message.trim().length < 10) {
      setError("Please write at least 10 characters")
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const res  = await fetch("/api/beta/feedback", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ type, message: message.trim(), page: pathname }),
      })
      const json = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || json.error) {
        setError(json.error ?? "Something went wrong")
      } else {
        setSuccess(true)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Panel ─────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 8,   scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[320px] glass-strong rounded-[var(--radius-xl)] border border-border/50 shadow-[var(--shadow-lg)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" aria-hidden="true" />
                <span className="text-[13px] font-semibold text-foreground">Beta Feedback</span>
                <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">BETA</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                aria-label="Close feedback"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            {success ? (
              <div className="flex flex-col items-center gap-3 py-8 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                  <CheckCircle2 className="size-6 text-primary" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">Thanks for the feedback!</p>
                  <p className="text-xs text-muted-foreground">We read every submission and use it to improve PodcastMatch AI.</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">

                {/* Type selector */}
                <div className="grid grid-cols-3 gap-1.5">
                  {TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-[var(--radius-md)] border px-2 py-2.5 text-[10px] font-semibold transition-colors",
                        type === t.id
                          ? "border-primary/40 bg-primary/12 text-primary"
                          : "border-border/40 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      <t.icon className="size-3.5" aria-hidden="true" />
                      {t.label}
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground -mt-1">
                  {TYPES.find(t => t.id === type)?.hint}
                </p>

                {/* Message */}
                <textarea
                  value={message}
                  onChange={e => { setMessage(e.target.value); setError(null) }}
                  placeholder="Describe the issue or idea…"
                  rows={4}
                  disabled={isLoading}
                  className="w-full resize-none rounded-[var(--radius-md)] border border-border/50 bg-muted/20 px-3 py-2.5 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                />

                {error && (
                  <p role="alert" className="text-[11px] text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || message.trim().length < 10}
                  className="flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-primary px-4 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLoading ? (
                    <><Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> Sending…</>
                  ) : (
                    <><Send className="size-3.5" aria-hidden="true" /> Send Feedback</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ─────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{   scale: 0.94 }}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close feedback" : "Give feedback"}
        aria-expanded={open}
        className={cn(
          "flex h-11 items-center gap-2 rounded-full border px-4 shadow-[var(--shadow-lg)]",
          "text-[12px] font-semibold transition-colors duration-150",
          open
            ? "border-border bg-card text-muted-foreground hover:text-foreground"
            : "gradient-primary border-0 text-white"
        )}
      >
        {open
          ? <><X className="size-3.5" aria-hidden="true" /> Close</>
          : <><MessageSquare className="size-3.5" aria-hidden="true" /> Feedback</>
        }
      </motion.button>

    </div>
  )
}
