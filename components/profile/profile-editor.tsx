"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Edit2, Check, X, Plus, Camera,
  Briefcase, Globe, Film,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/components/profile/profile-context"

/* ═══════════════════════════════════════════════════════════
   ProfileEditor — editable creator profile modules.
   Switches between read-only display and edit form.
   ═══════════════════════════════════════════════════════════ */

const BIO_MAX = 500

/* ── Pill tag ─────────────────────────────────────────────── */
function PillTag({
  label,
  removable,
  onRemove,
}: {
  label:    string
  removable?: boolean
  onRemove?: () => void
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5",
        "text-[11px] font-semibold",
        removable
          ? "border-primary/30 bg-primary/8 text-primary"
          : "border-border/50 bg-muted/30 text-foreground/80"
      )}
    >
      {label}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="ml-0.5 text-primary/60 hover:text-primary transition-colors"
        >
          <X className="size-2.5" aria-hidden="true" />
        </button>
      )}
    </span>
  )
}

/* ── Section wrapper ──────────────────────────────────────── */
function EditorSection({
  title,
  children,
}: {
  title:    string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
        {title}
      </span>
      {children}
    </div>
  )
}

/* ── Field input ──────────────────────────────────────────── */
function FieldInput({
  value,
  onChange,
  placeholder,
  multiline,
  maxLength,
}: {
  value:       string
  onChange:    (v: string) => void
  placeholder: string
  multiline?:  boolean
  maxLength?:  number
}) {
  const base = cn(
    "w-full rounded-[var(--radius-md)] border border-border/60 bg-muted/20",
    "px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50",
    "focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15",
    "transition-all duration-200 resize-none"
  )

  if (multiline) {
    return (
      <div className="relative">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          maxLength={maxLength}
          className={base}
        />
        {maxLength && (
          <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/40 tabular-nums">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    )
  }

  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={base}
    />
  )
}

/* ── Tag adder ────────────────────────────────────────────── */
function TagAdder({
  tags,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags:        string[]
  onAdd:       (t: string) => void
  onRemove:    (t: string) => void
  placeholder: string
}) {
  const [input, setInput] = React.useState("")

  function submit() {
    const v = input.trim()
    if (v && !tags.includes(v)) { onAdd(v); setInput("") }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Existing tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map(t => (
          <PillTag key={t} label={t} removable onRemove={() => onRemove(t)} />
        ))}
      </div>
      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); submit() } }}
          placeholder={placeholder}
          className={cn(
            "flex-1 rounded-[var(--radius-md)] border border-border/60 bg-muted/20",
            "px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15",
            "transition-all duration-200"
          )}
        />
        <button
          onClick={submit}
          aria-label="Add"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]",
            "border border-primary/30 bg-primary/8 text-primary",
            "hover:bg-primary/15 hover:border-primary/50 transition-colors"
          )}
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ── Social link row ──────────────────────────────────────── */
function SocialRow({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon:        React.ElementType
  label:       string
  value:       string
  onChange:    (v: string) => void
  placeholder: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)]",
        "border border-border/50 bg-muted/30 text-muted-foreground"
      )}>
        <Icon className="size-3.5" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={cn(
          "flex-1 rounded-[var(--radius-md)] border border-border/60 bg-muted/20",
          "px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50",
          "focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15",
          "transition-all duration-200"
        )}
      />
    </div>
  )
}

/* ── Main editor ──────────────────────────────────────────── */
export function ProfileEditor() {
  const {
    creator, isEditing,
    startEdit, cancelEdit, saveEdit,
    draft, setDraft,
    addTopic, removeTopic,
    addKeyword, removeKeyword,
  } = useProfile()

  const data = isEditing ? draft : creator

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 }}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)]"
      )}
      role="region"
      aria-label="Creator profile editor"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
        <span className="text-sm font-bold text-foreground">Profile Details</span>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={cancelEdit}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-border/50 px-3 py-1.5",
                  "text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                )}
              >
                <X className="size-3.5" aria-hidden="true" />
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-1.5",
                  "text-xs font-semibold text-white",
                  "bg-gradient-to-r from-primary to-[oklch(0.60_0.20_290)]",
                  "hover:opacity-90 transition-opacity"
                )}
              >
                <Check className="size-3.5" aria-hidden="true" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={startEdit}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-border/50 px-3 py-1.5",
                "text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border",
                "bg-card/50 backdrop-blur-sm transition-colors"
              )}
            >
              <Edit2 className="size-3.5" aria-hidden="true" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 p-5">

        {/* Bio */}
        <EditorSection title="Creator Bio">
          {isEditing ? (
            <FieldInput
              value={draft.bio}
              onChange={v => setDraft({ bio: v })}
              placeholder="Describe your creator identity, expertise, and the value you bring to podcast audiences…"
              multiline
              maxLength={BIO_MAX}
            />
          ) : (
            <p className="text-[12px] text-foreground/80 leading-relaxed">{data.bio}</p>
          )}
        </EditorSection>

        {/* Speaking topics */}
        <EditorSection title="Speaking Topics">
          {isEditing ? (
            <TagAdder
              tags={draft.topics}
              onAdd={addTopic}
              onRemove={removeTopic}
              placeholder="Add a topic (press Enter)"
            />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {data.topics.map(t => <PillTag key={t} label={t} />)}
            </div>
          )}
        </EditorSection>

        {/* Audience goal */}
        <EditorSection title="Audience Goal">
          {isEditing ? (
            <FieldInput
              value={draft.audienceGoal}
              onChange={v => setDraft({ audienceGoal: v })}
              placeholder="Describe the audience you want to reach through podcast appearances…"
              maxLength={200}
            />
          ) : (
            <p className="text-[12px] text-foreground/80 leading-relaxed">{data.audienceGoal}</p>
          )}
        </EditorSection>

        {/* Creator keywords */}
        <EditorSection title="Creator Keywords">
          {isEditing ? (
            <TagAdder
              tags={draft.keywords}
              onAdd={addKeyword}
              onRemove={removeKeyword}
              placeholder="Add a keyword (press Enter)"
            />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {data.keywords.map(k => <PillTag key={k} label={k} />)}
            </div>
          )}
        </EditorSection>

        {/* Social links */}
        <EditorSection title="Social Links">
          <AnimatePresence>
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{   opacity: 0, height: 0 }}
                className="flex flex-col gap-2.5 overflow-hidden"
              >
                {[
                  { icon: Camera,    label: "Instagram", key: "instagram" as const, placeholder: "@handle" },
                  { icon: Briefcase, label: "LinkedIn",  key: "linkedin"  as const, placeholder: "linkedin.com/in/…" },
                  { icon: Globe,     label: "Website",   key: "website"   as const, placeholder: "yourwebsite.com" },
                  { icon: Film,      label: "YouTube",   key: "youtube"   as const, placeholder: "@channel" },
                ].map(s => (
                  <SocialRow
                    key={s.key}
                    icon={s.icon}
                    label={s.label}
                    value={draft.socialLinks[s.key]}
                    onChange={v => setDraft({ socialLinks: { ...draft.socialLinks, [s.key]: v } })}
                    placeholder={s.placeholder}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.socialLinks)
                  .filter(([, v]) => v)
                  .map(([key, val]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/25 px-2.5 py-1 text-[11px] text-foreground/70"
                    >
                      {val}
                    </span>
                  ))
                }
              </div>
            )}
          </AnimatePresence>
        </EditorSection>

      </div>
    </motion.div>
  )
}
