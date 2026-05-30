"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, StepNav } from "../dna-inputs"

const AUDIENCES = [
  { emoji: "🚀", label: "Entrepreneurs & Founders",    description: "People building companies and startups" },
  { emoji: "💼", label: "Business Professionals",      description: "Executives, managers, and corporate leaders" },
  { emoji: "🎓", label: "Students & Early Career",     description: "People building their path and skillset" },
  { emoji: "🧭", label: "Coaches & Consultants",       description: "Practitioners who help others grow" },
  { emoji: "🌍", label: "The General Curious Public",  description: "Broad audiences hungry to learn and grow" },
  { emoji: "🔬", label: "Industry Specialists",        description: "Deep experts in a specific professional field" },
]

const SIZES = [
  { label: "Just starting out",       description: "Building my presence from the ground up" },
  { label: "1K – 10K followers",      description: "Growing a meaningful audience" },
  { label: "10K – 50K followers",     description: "Established with real momentum" },
  { label: "50K – 250K followers",    description: "Large audience with strong influence" },
  { label: "250K+ followers",         description: "Significant reach and public recognition" },
]

export function Step3Audience() {
  const { formData, setField, next, back } = useDNA()
  const canNext = formData.targetAudience !== ""

  return (
    <StepCard>
      <StepHeader
        headline="Who do you primarily create for?"
        sub="Understanding your audience helps us match you with podcasts whose listeners are your ideal people."
      />

      <SectionLabel>Your Target Audience</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {AUDIENCES.map(({ emoji, label, description }) => (
          <SelectionCard
            key={label}
            emoji={emoji}
            label={label}
            description={description}
            selected={formData.targetAudience === label}
            onClick={() => setField("targetAudience", label)}
          />
        ))}
      </div>

      <SectionLabel>Your Current Reach</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SIZES.map(({ label, description }) => (
          <SelectionCard
            key={label}
            label={label}
            description={description}
            selected={formData.audienceSize === label}
            onClick={() => setField("audienceSize", label)}
          />
        ))}
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
