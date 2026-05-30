"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, StepNav } from "../dna-inputs"

const EXPERTISE_AREAS = [
  { emoji: "💼", label: "Business & Entrepreneurship" },
  { emoji: "⚡", label: "Technology & Innovation" },
  { emoji: "🌿", label: "Health & Wellness" },
  { emoji: "🧠", label: "Personal Development" },
  { emoji: "📈", label: "Finance & Investing" },
  { emoji: "🏆", label: "Leadership & Management" },
  { emoji: "📣", label: "Marketing & Branding" },
  { emoji: "🔬", label: "Science & Research" },
  { emoji: "🎨", label: "Arts & Culture" },
  { emoji: "🕊️", label: "Spirituality & Mindfulness" },
  { emoji: "👨‍👩‍👧", label: "Parenting & Family" },
  { emoji: "📖", label: "Education & Learning" },
]

const YEARS = [
  { label: "1–2 years",   description: "Still establishing my foundation" },
  { label: "3–5 years",   description: "Growing and gaining recognition" },
  { label: "6–10 years",  description: "Established with a solid track record" },
  { label: "10+ years",   description: "Recognized authority in my field" },
]

export function Step2Expertise() {
  const { formData, setField, next, back } = useDNA()
  const canNext = formData.expertise !== ""

  return (
    <StepCard>
      <StepHeader
        headline="What's your primary area of expertise?"
        sub="Select your main field. We use this to match you with podcast audiences hungry for your knowledge."
      />

      <SectionLabel>Your Expertise Area</SectionLabel>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8">
        {EXPERTISE_AREAS.map(({ emoji, label }) => (
          <SelectionCard
            key={label}
            emoji={emoji}
            label={label}
            selected={formData.expertise === label}
            onClick={() => setField("expertise", label)}
          />
        ))}
      </div>

      <SectionLabel>Years in Your Field</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {YEARS.map(({ label, description }) => (
          <SelectionCard
            key={label}
            label={label}
            description={description}
            selected={formData.yearsInField === label}
            onClick={() => setField("yearsInField", label)}
          />
        ))}
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
