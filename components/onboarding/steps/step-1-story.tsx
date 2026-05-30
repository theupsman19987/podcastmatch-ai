"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, TagPill, StepTextarea, StepNav } from "../dna-inputs"

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
  const { formData, setField, toggleArrayField, next } = useDNA()
  const canNext = formData.s1_lifeExperience.trim().length >= 10

  return (
    <StepCard>
      <StepHeader
        headline="Your Story"
        sub="Help us understand the experiences and mission behind your voice."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>1. What life experience has most shaped who you are today?</SectionLabel>
          <StepTextarea
            value={formData.s1_lifeExperience}
            onChange={v => setField("s1_lifeExperience", v)}
            placeholder="Share the defining moment, event, or journey that made you who you are..."
            rows={4}
          />
        </div>

        <div>
          <SectionLabel>2. What challenge have you overcome that others frequently ask you about?</SectionLabel>
          <StepTextarea
            value={formData.s1_challengeOvercome}
            onChange={v => setField("s1_challengeOvercome", v)}
            placeholder="Describe the obstacle you've navigated that others look to you for guidance on..."
            rows={3}
          />
        </div>

        <div>
          <SectionLabel>3. What personal transformation are you most passionate about sharing?</SectionLabel>
          <StepTextarea
            value={formData.s1_personalTransformation}
            onChange={v => setField("s1_personalTransformation", v)}
            placeholder="What change happened in your life or work that you feel compelled to share with the world..."
            rows={3}
          />
        </div>

        <div>
          <SectionLabel>4. What motivates you to appear on podcasts? — select all that apply</SectionLabel>
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

        <div>
          <SectionLabel>5. What impact do you want your message to have on listeners?</SectionLabel>
          <StepTextarea
            value={formData.s1_messageImpact}
            onChange={v => setField("s1_messageImpact", v)}
            placeholder="After someone hears you speak, what do you want them to feel, think, or do differently..."
            rows={3}
          />
        </div>
      </div>

      <StepNav canNext={canNext} onNext={next} />
    </StepCard>
  )
}
