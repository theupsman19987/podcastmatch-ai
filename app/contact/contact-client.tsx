"use client"

import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Mail, Clock, MessageSquare, CheckCircle, AlertCircle, ArrowRight, Send } from "lucide-react"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* ── Types ───────────────────────────────────────────────────── */
type Status = "idle" | "loading" | "success" | "error"

const SUBJECTS = [
  "General Inquiry",
  "Partnership / Press",
  "Technical Support",
  "Feedback & Ideas",
  "Billing Question",
  "Other",
]

/* ── Info cards ──────────────────────────────────────────────── */
const INFO_CARDS = [
  {
    icon: Mail,
    title: "Email Us",
    value: "hello@podcastmatchai.com",
    description: "Drop us a line any time.",
    color: "primary" as const,
  },
  {
    icon: Clock,
    title: "Response Time",
    value: "1–2 business days",
    description: "We read every message.",
    color: "cyan" as const,
  },
  {
    icon: MessageSquare,
    title: "What We Help With",
    value: "Anything",
    description: "Questions, partnerships, feedback, support.",
    color: "gold" as const,
  },
]

const ACCENT = {
  primary: { icon: "text-primary", bg: "bg-primary/15", glow: "glow-subtle" },
  cyan:    { icon: "text-premium-cyan", bg: "bg-premium-cyan/15", glow: "glow-cyan" },
  gold:    { icon: "text-premium-gold", bg: "bg-premium-gold/15", glow: "glow-gold" },
}

/* ── Input component (inline — matches project style) ────────── */
function Field({
  label, id, required, error, children,
}: {
  label: string; id: string; required?: boolean; error?: string; children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-muted-foreground/35" aria-hidden="true">*</span>}
      </label>
      {children}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            role="alert"
            key={error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls = (hasError?: boolean) =>
  cn(
    "w-full rounded-[var(--radius-md)] border bg-muted/15 backdrop-blur-sm",
    "px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/35",
    "outline-none transition-all duration-200",
    hasError
      ? "border-red-500/50 bg-red-500/5 focus:border-red-400/70 focus:shadow-[0_0_0_3px_oklch(0.63_0.22_25_/_0.10)]"
      : "border-border/40 focus:border-primary/50 focus:bg-muted/25 focus:shadow-[0_0_0_3px_oklch(0.58_0.22_255_/_0.10)]",
  )

/* ── Main component ──────────────────────────────────────────── */
export function ContactClient() {
  const [name,    setName]    = useState("")
  const [email,   setEmail]   = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status,  setStatus]  = useState<Status>("idle")
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim())                               e.name    = "Your name is required"
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email   = "A valid email is required"
    if (!subject)                                   e.subject = "Please choose a subject"
    if (!message.trim() || message.length < 10)    e.message = "Message must be at least 10 characters"
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, subject, message }),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <main id="main-content" className="relative min-h-screen py-24 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl bg-primary/8 -translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-premium-cyan/6" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl bg-premium-gold/5" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ─────────────────────────────────────── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge variant="cyan" className="mb-5 uppercase tracking-widest text-xs">
              Get In Touch
            </Badge>
          </motion.div>

          <motion.h1
            className="text-h1 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            We&apos;d love to{" "}
            <span className="gradient-text-primary">hear from you</span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            Questions, partnerships, feedback — whatever&apos;s on your mind,
            we read every message and reply personally.
          </motion.p>
        </div>

        {/* ── Info cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {INFO_CARDS.map((card, i) => {
            const a = ACCENT[card.color]
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={cn("glass rounded-xl p-5", a.glow)}
              >
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", a.bg)}>
                  <card.icon size={18} className={a.icon} />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-sm font-semibold text-foreground mb-0.5">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* ── Form card ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-2xl p-8 sm:p-10 max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">

            {/* Success state */}
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5 glow-subtle">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h2 className="text-h3 mb-3">Message sent!</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  Thanks for reaching out. We&apos;ll get back to you at{" "}
                  <span className="text-foreground font-medium">{email}</span> within
                  1–2 business days.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle")
                    setName(""); setEmail(""); setSubject(""); setMessage("")
                  }}
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 mx-auto"
                >
                  Send another message <ArrowRight size={14} />
                </button>
              </motion.div>
            ) : (

              /* Form state */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-foreground mb-1">Send us a message</h2>
                  <p className="text-sm text-muted-foreground">
                    Fill in the form and we&apos;ll be in touch.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Your name" id="name" required error={errors.name}>
                    <input
                      id="name"
                      type="text"
                      placeholder="Jane Smith"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      autoComplete="name"
                      disabled={status === "loading"}
                      className={inputCls(!!errors.name)}
                    />
                  </Field>

                  <Field label="Email address" id="email" required error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={status === "loading"}
                      className={inputCls(!!errors.email)}
                    />
                  </Field>
                </div>

                <Field label="Subject" id="subject" required error={errors.subject}>
                  <select
                    id="subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    disabled={status === "loading"}
                    className={cn(inputCls(!!errors.subject), "cursor-pointer")}
                  >
                    <option value="" disabled className="bg-card text-muted-foreground">
                      Choose a topic…
                    </option>
                    {SUBJECTS.map(s => (
                      <option key={s} value={s} className="bg-card text-foreground">{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Message" id="message" required error={errors.message}>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us what's on your mind…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    disabled={status === "loading"}
                    className={cn(inputCls(!!errors.message), "resize-none leading-relaxed")}
                  />
                </Field>

                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    Something went wrong. Please try again or email us directly at{" "}
                    <a href="mailto:hello@podcastmatchai.com" className="underline underline-offset-2">
                      hello@podcastmatchai.com
                    </a>
                  </motion.p>
                )}

                <ShimmerButton
                  type="submit"
                  size="lg"
                  disabled={status === "loading"}
                  className="w-full justify-center"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message <Send size={16} />
                    </span>
                  )}
                </ShimmerButton>

                <p className="text-center text-xs text-muted-foreground">
                  Or email us directly at{" "}
                  <a
                    href="mailto:hello@podcastmatchai.com"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    hello@podcastmatchai.com
                  </a>
                </p>
              </motion.form>
            )}

          </AnimatePresence>
        </motion.div>

      </div>
    </main>
  )
}
