"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { AlertTriangle, Download, FileDown, Trash2, X } from "lucide-react"
import { SettingsCard, SectionHeader } from "../settings-ui"

interface ConfirmModalProps {
  title: string
  description: string
  confirmLabel: string
  confirmClass: string
  onConfirm: () => void
  onCancel: () => void
  requireText?: string
}

function ConfirmModal({ title, description, confirmLabel, confirmClass, onConfirm, onCancel, requireText }: ConfirmModalProps) {
  const [input, setInput] = useState("")
  const ready = !requireText || input === requireText

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.4)] p-6"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-destructive/30 to-transparent rounded-t-2xl" />

        <button onClick={onCancel} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-destructive/10 border border-destructive/25 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{description}</p>

        {requireText && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">
              Type <span className="font-mono font-bold text-foreground">{requireText}</span> to confirm:
            </p>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={requireText}
              className="w-full px-3.5 py-2 rounded-xl bg-card/60 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-destructive/50 transition-colors font-mono"
            />
          </div>
        )}

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-border/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!ready}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

type ModalType = "export" | "download" | "delete" | null

export function DangerZone() {
  const [modal, setModal]     = useState<ModalType>(null)
  const [done,  setDone]      = useState<Set<string>>(new Set())

  function handleConfirm(type: ModalType) {
    if (type) setDone(d => new Set(d).add(type))
    setModal(null)
  }

  const ACTIONS = [
    {
      id:          "export" as const,
      Icon:        Download,
      title:       "Export Your Data",
      description: "Download a complete copy of all your PodcastMatch AI data including profile, matches, and preferences as a JSON file.",
      buttonLabel: "Export Data",
      buttonClass: "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20",
      modal: {
        title:        "Export Your Data",
        description:  "We'll package your complete account data and prepare a download. This may take a moment.",
        confirmLabel: "Export Data",
        confirmClass: "border-primary/40 bg-primary/15 text-primary hover:bg-primary/25",
      },
    },
    {
      id:          "download" as const,
      Icon:        FileDown,
      title:       "Download Creator Profile",
      description: "Download your AI-generated Creator Profile as a shareable PDF — perfect for media kits and pitching to podcast hosts.",
      buttonLabel: "Download Profile PDF",
      buttonClass: "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20",
      modal: {
        title:        "Download Creator Profile",
        description:  "Your AI Brand Profile and Creator DNA summary will be formatted as a professional PDF ready to share.",
        confirmLabel: "Download PDF",
        confirmClass: "border-primary/40 bg-primary/15 text-primary hover:bg-primary/25",
      },
    },
    {
      id:          "delete" as const,
      Icon:        Trash2,
      title:       "Delete Account",
      description: "Permanently delete your account and all associated data. This action is irreversible. Your subscription will be cancelled immediately.",
      buttonLabel: "Delete Account",
      buttonClass: "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20",
      modal: {
        title:        "Delete Account",
        description:  "This will permanently erase your account, profile, matches, outreach history, and all data. This cannot be undone.",
        confirmLabel: "Permanently Delete",
        confirmClass: "border-destructive/50 bg-destructive/15 text-destructive hover:bg-destructive/25",
        requireText:  "delete my account",
      },
    },
  ]

  return (
    <>
      <SettingsCard delay={0}>
        <div className="p-6 md:p-8">
          <SectionHeader
            icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
            title="Danger Zone"
            description="Irreversible actions — please proceed carefully"
          />

          <div className="flex flex-col gap-3">
            {ACTIONS.map(({ id, Icon, title, description, buttonLabel, buttonClass }) => (
              <div
                key={id}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-colors duration-150 ${
                  id === "delete"
                    ? "border-destructive/20 bg-destructive/5 hover:bg-destructive/8"
                    : "border-border/30 bg-card/40 hover:bg-card/60"
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${id === "delete" ? "bg-destructive/10 border-destructive/25 text-destructive" : "bg-card/60 border-border/30 text-muted-foreground"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{description}</p>
                    {done.has(id) && (
                      <p className="text-[10px] text-emerald-400 mt-1">✓ Action completed</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setModal(id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-150 shrink-0 ${buttonClass}`}
                >
                  {buttonLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>

      <AnimatePresence>
        {modal && (() => {
          const action = ACTIONS.find(a => a.id === modal)!
          return (
            <ConfirmModal
              key={modal}
              title={action.modal.title}
              description={action.modal.description}
              confirmLabel={action.modal.confirmLabel}
              confirmClass={action.modal.confirmClass}
              requireText={"requireText" in action.modal ? action.modal.requireText : undefined}
              onConfirm={() => handleConfirm(modal)}
              onCancel={() => setModal(null)}
            />
          )
        })()}
      </AnimatePresence>
    </>
  )
}
