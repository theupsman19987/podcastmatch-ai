"use client"

import * as React from "react"
import { useState } from "react"
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type FormState = "idle" | "loading" | "success"

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail]   = useState("")
  const [state, setState]   = useState<FormState>("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return
    setState("loading")
    // TODO: connect to email service (Resend / Mailchimp / ConvertKit)
    await new Promise<void>(res => setTimeout(res, 900))
    setState("success")
  }

  if (state === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          "text-[oklch(0.65_0.15_145)]",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="size-4 flex-shrink-0" aria-hidden="true" />
        You&rsquo;re in — podcast opportunities incoming.
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full max-w-sm gap-2", className)}
      noValidate
      aria-label="Subscribe to podcast opportunity updates"
    >
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={state === "loading"}
        autoComplete="email"
        aria-label="Email address"
        className={cn(
          "h-10 flex-1 min-w-0 rounded-[var(--radius-md)]",
          "border border-border bg-muted/30",
          "px-3 text-sm text-foreground",
          "placeholder:text-muted-foreground/55",
          "outline-none transition-colors duration-200",
          "focus:border-primary/40 focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      />
      <Button
        type="submit"
        variant="premium"
        size="default"
        disabled={state === "loading" || !email.trim()}
        className="flex-shrink-0"
        aria-label="Subscribe to newsletter"
      >
        {state === "loading" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-4" aria-hidden="true" />
        )}
      </Button>
    </form>
  )
}
