"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, StepTextarea, StepNav } from "../dna-inputs"

const CREATOR_TYPES = [
  { emoji: "🎤", label: "Speaker",         description: "You inspire from stages and presentations" },
  { emoji: "📚", label: "Author",           description: "You share ideas through writing and books" },
  { emoji: "🧭", label: "Coach",            description: "You guide others to achieve transformation" },
  { emoji: "💼", label: "Consultant",       description: "You solve problems with expert advice" },
  { emoji: "🚀", label: "Entrepreneur",     description: "You build companies and lead ventures" },
  { emoji: "🎓", label: "Educator",         description: "You teach and expand what people know" },
  { emoji: "🎙️", label: "Podcaster",       description: "You create audio content and conversations" },
  { emoji: "💡", label: "Thought Leader",   description: "You shape ideas and shift perspectives" },
]

export function Step1Story() {
  const { formData, setField, next } = useDNA()
  const canNext = formData.creatorType !== ""

  return (
    <StepCard>
      <StepHeader
        headline="What best describes your creator role?"
        sub="Choose the one that feels most like you. This shapes how we match you with podcast hosts."
      />

      <SectionLabel>Your Creator Type</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {CREATOR_TYPES.map(({ emoji, label, description }) => (
          <SelectionCard
            key={label}
            emoji={emoji}
            label={label}
            description={description}
            selected={formData.creatorType === label}
            onClick={() => setField("creatorType", label)}
          />
        ))}
      </div>

      <SectionLabel>Your One-Liner (optional)</SectionLabel>
      <StepTextarea
        value={formData.tagline}
        onChange={v => setField("tagline", v)}
        placeholder="e.g. I help startup founders build scalable teams without burning out."
        rows={3}
        maxLength={150}
      />

      <StepNav canNext={canNext} onNext={next} />
    </StepCard>
  )
}
