"use client"

import { motion } from "motion/react"
import { Receipt, Download } from "lucide-react"
import { SettingsCard, SectionHeader } from "../settings-ui"
import { MOCK_INVOICES } from "../settings-mock"
import type { InvoiceStatus } from "../settings-mock"

function statusStyle(s: InvoiceStatus) {
  if (s === "paid")    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
  if (s === "pending") return "bg-yellow-500/10  border-yellow-500/30  text-yellow-400"
  return "bg-destructive/10 border-destructive/30 text-destructive"
}

export function BillingHistory() {
  return (
    <SettingsCard delay={0}>
      <div className="p-6 md:p-8">
        <SectionHeader
          icon={<Receipt className="w-4 h-4 text-primary" />}
          title="Billing History"
          description="Download invoices and review past charges"
        />

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_2fr_auto_auto_auto] gap-4 px-3 mb-2">
          {["Invoice", "Description", "Amount", "Status", ""].map(h => (
            <span key={h} className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{h}</span>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_INVOICES.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto_auto_auto] gap-2 sm:gap-4 items-center p-3.5 rounded-xl border border-border/30 bg-card/40 hover:bg-card/60 transition-colors duration-150"
            >
              <div>
                <p className="text-xs font-mono font-semibold text-foreground">{inv.id}</p>
                <p className="text-[10px] text-muted-foreground sm:hidden">{inv.date}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/80">{inv.description}</p>
                <p className="text-[10px] text-muted-foreground hidden sm:block">{inv.date}</p>
              </div>
              <p className="text-xs font-bold text-foreground">{inv.amount}</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize w-fit ${statusStyle(inv.status)}`}>
                {inv.status}
              </span>
              <button className="flex items-center justify-center w-7 h-7 rounded-lg border border-border/30 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                <Download className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground mt-4 text-center">
          Invoices are also emailed automatically to {MOCK_INVOICES.length > 0 ? "your registered email" : "—"}.
        </p>
      </div>
    </SettingsCard>
  )
}
