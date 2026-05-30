"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, StepTextarea, StepNav } from "../dna-inputs"

export function Step7Positioning() {
  const { formData, setField, back, finish } = useDNA()
  const canFinish = formData.uniquePerspective.trim().length >= 10

  return (
    <StepCard>
      <StepHeader
        headline="Define your creator positioning."
        sub="This is the final piece. Be honest and specific — your uniqueness is what makes hosts want you on their show."
      />

      <SectionLabel>What makes your perspective genuinely unique?</SectionLabel>
      <div className="mb-6">
        <StepTextarea
          value={formData.uniquePerspective}
          onChange={v => setField("uniquePerspective", v)}
          placeholder="e.g. I spent 12 years in corporate finance before losing everything and rebuilding from scratch. That contrast gives me a perspective most financial advisors can't offer — I know what it's like on both sides."
          rows={5}
          maxLength={400}
        />
      </div>

      <SectionLabel>What's the one thing you want every listener to walk away knowing?</SectionLabel>
      <StepTextarea
        value={formData.keyTakeaway}
        onChange={v => setField("keyTakeaway", v)}
        placeholder="e.g. That building wealth isn't about strategy — it's about identity. Once you shift who you believe you are, the tactics become obvious."
        rows={4}
        maxLength={400}
      />

      <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/15">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-primary font-semibold">Almost there.</span> Once you click Generate, our AI will build your Creator Profile and surface your top podcast matches.
        </p>
      </div>

      <StepNav canNext={canFinish} onBack={back} onNext={finish} isLast />
    </StepCard>
  )
}
