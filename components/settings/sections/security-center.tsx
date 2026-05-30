"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import { useInView } from "motion/react"
import { Shield, Monitor, Smartphone, Laptop, CheckCircle2, AlertCircle, XCircle, LogOut } from "lucide-react"
import { SettingsCard, SectionHeader } from "../settings-ui"
import { MOCK_SESSIONS, SECURITY_CHECKS } from "../settings-mock"
import type { Session, SecurityCheck } from "../settings-mock"

const SECURITY_SCORE = 72

function DeviceIcon({ device }: { device: string }) {
  if (device.toLowerCase().includes("iphone") || device.toLowerCase().includes("mobile")) return <Smartphone className="w-4 h-4" />
  if (device.toLowerCase().includes("macbook") || device.toLowerCase().includes("laptop")) return <Laptop className="w-4 h-4" />
  return <Monitor className="w-4 h-4" />
}

function SessionRow({ session, index }: { session: Session; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.06 }}
      className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-colors duration-150 ${
        session.current ? "border-primary/30 bg-primary/5" : "border-border/30 bg-card/40 hover:bg-card/60"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${session.current ? "bg-primary/15 border-primary/25 text-primary" : "bg-card/60 border-border/30 text-muted-foreground"}`}>
          <DeviceIcon device={session.device} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-foreground">{session.device}</p>
            {session.current && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 border border-primary/20 text-primary">
                This device
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">{session.browser} · {session.location} · {session.lastActive}</p>
        </div>
      </div>
      {!session.current && (
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-border/30 text-muted-foreground hover:border-destructive/40 hover:text-destructive transition-colors">
          <LogOut className="w-3 h-3" />
          Revoke
        </button>
      )}
    </motion.div>
  )
}

function CheckRow({ check, index }: { check: SecurityCheck; index: number }) {
  const Icon = check.status === "done" ? CheckCircle2 : check.status === "warn" ? AlertCircle : XCircle
  const color = check.status === "done" ? "text-emerald-400" : check.status === "warn" ? "text-yellow-400" : "text-destructive"
  const bg    = check.status === "done" ? "bg-emerald-500/10 border-emerald-500/20" : check.status === "warn" ? "bg-yellow-500/10 border-yellow-500/20" : "bg-destructive/10 border-destructive/20"

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.06 }}
      className="flex items-center justify-between gap-3 py-3 border-b border-border/20 last:border-0"
    >
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${bg}`}>
          <Icon className={`w-3.5 h-3.5 ${color}`} />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">{check.label}</p>
          <p className="text-[10px] text-muted-foreground">{check.detail}</p>
        </div>
      </div>
      {check.status !== "done" && (
        <button className="text-[10px] font-semibold text-primary hover:text-primary/70 shrink-0">
          Fix now →
        </button>
      )}
    </motion.div>
  )
}

function ScoreArc({ score }: { score: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })
  const size = 80
  const r = 32
  const c = 2 * Math.PI * r
  const offset = c * (1 - score / 100)
  const color = score >= 80 ? "oklch(0.72 0.18 160)" : score >= 60 ? "oklch(0.85 0.16 85)" : "oklch(0.65 0.22 25)"

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={4} className="text-border/30" />
          <motion.circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={color} strokeWidth={4}
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: inView ? offset : c }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{score}</span>
        </div>
      </div>
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Protection Score</p>
    </div>
  )
}

export function SecurityCenter() {
  return (
    <div className="flex flex-col gap-5">
      {/* Score + checks */}
      <SettingsCard delay={0}>
        <div className="p-6 md:p-8">
          <SectionHeader
            icon={<Shield className="w-4 h-4 text-primary" />}
            title="Security Center"
            description="Monitor your account health and active sessions"
          />

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="sm:shrink-0">
              <ScoreArc score={SECURITY_SCORE} />
              <p className="text-[10px] text-muted-foreground text-center mt-2 max-w-[80px] mx-auto">
                Enable 2FA to reach 100
              </p>
            </div>
            <div className="flex-1 min-w-0">
              {SECURITY_CHECKS.map((check, i) => (
                <CheckRow key={check.id} check={check} index={i} />
              ))}
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Sessions */}
      <SettingsCard delay={0.05}>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-bold text-foreground">Active Sessions</p>
              <p className="text-xs text-muted-foreground">{MOCK_SESSIONS.length} devices currently signed in</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-border/40 text-muted-foreground hover:border-destructive/40 hover:text-destructive transition-colors">
              Revoke All Others
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_SESSIONS.map((session, i) => (
              <SessionRow key={session.id} session={session} index={i} />
            ))}
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}
