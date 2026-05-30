"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, TagPill, StepNav } from "../dna-inputs"

const FORMATS = [
  "Long-form deep dive", "Quick insight burst", "Panel discussion",
  "Debate & challenge", "Q&A format", "Story-driven narrative",
  "Case studies", "Solo commentary", "Live audience",
]

const TOPICS = [
  "AI & Future of Work", "Leadership", "Mental Health & Wellbeing",
  "Entrepreneurship", "Wealth Building", "Innovation & Disruption",
  "Personal Branding", "Relationships", "Productivity & Focus",
  "Sustainability", "Diversity & Inclusion", "Sales & Marketing",
  "Career Growth", "Health & Fitness", "Mindset & Purpose",
  "Social Impact", "Education & Learning", "Tech & Startups",
  "Creativity", "Spirituality", "Parenting", "Real Estate",
]

export function Step5Interests() {
  const { formData, toggleArrayField, next, back } = useDNA()
  const canNext = formData.passionTopics.length > 0

  return (
    <StepCard>
      <StepHeader
        headline="What podcast experiences excite you?"
        sub="Tell us your preferred formats and the topics you're most fired up to talk about."
      />

      <SectionLabel>Preferred Formats — pick up to 3</SectionLabel>
      <div className="flex flex-wrap gap-2 mb-8">
        {FORMATS.map(f => (
          <TagPill
            key={f}
            label={f}
            selected={formData.podcastFormats.includes(f)}
            onClick={() => toggleArrayField("podcastFormats", f, 3)}
          />
        ))}
      </div>

      <SectionLabel>Your Passion Topics — pick up to 5</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(t => (
          <TagPill
            key={t}
            label={t}
            selected={formData.passionTopics.includes(t)}
            onClick={() => toggleArrayField("passionTopics", t, 5)}
          />
        ))}
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
