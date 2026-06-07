"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, TagPill, StepNav } from "../dna-inputs"

const MOTIVATIONS = [
  "Grow my audience",
  "Share an important message",
  "Build authority & credibility",
  "Find ideal clients",
  "Promote my book / course / product",
  "Connect with thought leaders",
  "Drive business growth",
  "Give back and add value",
]

export function Step1Story() {
  const { formData, toggleArrayField, next } = useDNA()
  const canNext = formData.s1_podcastMotivation.length > 0

  return (
    <StepCard>
      <StepHeader
        headline="Your Goals"
        sub="Tell us what you want to achieve through podcast appearances."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>1. What motivates you to appear on podcasts? — select all that apply</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {MOTIVATIONS.map(m => (
              <TagPill
                key={m}
                label={m}
                selected={formData.s1_podcastMotivation.includes(m)}
                onClick={() => toggleArrayField("s1_podcastMotivation", m)}
              />
            ))}
          </div>
        </div>
      </div>

      <StepNav canNext={canNext} onNext={next} />
    </StepCard>
  )
}
