"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, StepNav } from "../dna-inputs"

const STYLES = [
  { emoji: "📐", label: "The Educator",    description: "I break complex ideas into clear, actionable understanding" },
  { emoji: "📖", label: "The Storyteller", description: "I captivate through narrative, emotion, and vivid examples" },
  { emoji: "🏋️", label: "The Coach",       description: "I motivate and push people to take meaningful action" },
  { emoji: "⚡", label: "The Challenger",  description: "I disrupt conventional thinking and spark bold conversations" },
  { emoji: "🔭", label: "The Visionary",   description: "I paint a compelling picture of what's possible ahead" },
  { emoji: "🤝", label: "The Connector",   description: "I bridge worlds and make ideas feel personal and relatable" },
]

const ENERGY = [
  { label: "Calm & Measured",       description: "Thoughtful, deliberate, and deeply considered" },
  { label: "Balanced & Adaptive",   description: "I read the room and match the energy of the conversation" },
  { label: "High Energy & Dynamic", description: "Passionate, fast-paced, and genuinely electrifying" },
]

export function Step4Communication() {
  const { formData, setField, next, back } = useDNA()
  const canNext = formData.communicationStyle !== ""

  return (
    <StepCard>
      <StepHeader
        headline="How do you show up in conversations?"
        sub="Your communication archetype helps hosts know exactly what kind of energy and insight to expect from you."
      />

      <SectionLabel>Your Communication Archetype</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {STYLES.map(({ emoji, label, description }) => (
          <SelectionCard
            key={label}
            emoji={emoji}
            label={label}
            description={description}
            selected={formData.communicationStyle === label}
            onClick={() => setField("communicationStyle", label)}
          />
        ))}
      </div>

      <SectionLabel>Your Natural Energy</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ENERGY.map(({ label, description }) => (
          <SelectionCard
            key={label}
            label={label}
            description={description}
            selected={formData.energyLevel === label}
            onClick={() => setField("energyLevel", label)}
          />
        ))}
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
