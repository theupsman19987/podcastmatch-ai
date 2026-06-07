"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, TagPill, StepNav } from "../dna-inputs"

const PODCAST_CATEGORIES = [
  "Business", "Entrepreneurship", "Health & Wellness", "Personal Development",
  "Finance & Money", "Leadership", "Technology", "Marketing", "Society & Culture",
  "Education", "Science", "Spirituality & Faith", "Sports & Fitness",
  "Arts & Entertainment", "Parenting & Family", "True Crime", "Comedy",
]

const FORMATS = [
  "Long-form interview (60+ min)", "Mid-form interview (30–60 min)",
  "Short-form insight (under 30 min)", "Panel discussion",
  "Solo commentary episode", "Live audience recording",
  "Story-driven narrative", "Case study deep dive", "Q&A format",
]

export function Step5Interests() {
  const { formData, toggleArrayField, next, back } = useDNA()
  const canNext = formData.s5_podcastCategories.length > 0

  return (
    <StepCard>
      <StepHeader
        headline="Your Podcast Compatibility"
        sub="Tell us the kinds of shows and formats that fit you best."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>15. What podcast categories interest you most? — pick up to 5</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {PODCAST_CATEGORIES.map(c => (
              <TagPill
                key={c}
                label={c}
                selected={formData.s5_podcastCategories.includes(c)}
                onClick={() => toggleArrayField("s5_podcastCategories", c, 5)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>16. Which podcast formats fit you best? — pick up to 3</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map(f => (
              <TagPill
                key={f}
                label={f}
                selected={formData.s5_podcastFormats.includes(f)}
                onClick={() => toggleArrayField("s5_podcastFormats", f, 3)}
              />
            ))}
          </div>
        </div>
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
