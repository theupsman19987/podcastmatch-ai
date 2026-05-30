"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, TagPill, StepNav } from "../dna-inputs"

const PODCAST_CATEGORIES = [
  "Business", "Entrepreneurship", "Health & Wellness", "Personal Development",
  "Finance & Money", "Leadership", "Technology", "Marketing", "Society & Culture",
  "Education", "Science", "Spirituality & Faith", "Sports & Fitness",
  "Arts & Entertainment", "Parenting & Family", "True Crime", "Comedy",
]

const HOST_CONVERSATIONS = [
  { label: "Deep-dive intellectual",     description: "Long-form exploration of big ideas and nuance" },
  { label: "Story-driven & personal",    description: "Narrative-led with human connection at the core" },
  { label: "Practical how-to",           description: "Tactical and actionable content audiences can apply now" },
  { label: "Debate and challenge",       description: "Respectful friction that sharpens ideas" },
  { label: "Inspirational & visionary",  description: "Big-picture thinking and motivational energy" },
  { label: "Q&A with the audience",      description: "Interactive and community-driven conversation" },
]

const AUDIENCE_SIZES = [
  { label: "Any size — quality over quantity",  description: "A perfect fit matters more than listener count" },
  { label: "1K – 10K listeners",               description: "Niche, highly engaged communities" },
  { label: "10K – 50K listeners",              description: "Growing shows with real momentum" },
  { label: "50K – 250K listeners",             description: "Established shows with strong reach" },
  { label: "250K+ listeners",                  description: "Major mainstream podcast audiences" },
]

const FORMATS = [
  "Long-form interview (60+ min)", "Mid-form interview (30–60 min)",
  "Short-form insight (under 30 min)", "Panel discussion",
  "Solo commentary episode", "Live audience recording",
  "Story-driven narrative", "Case study deep dive", "Q&A format",
]

const OPPORTUNITIES = [
  "Guest appearances", "Co-hosting opportunities", "Expert commentary segments",
  "Sponsored content", "Multi-episode series", "Repeat / recurring appearances",
  "Podcast launch collaborations", "Educational content partnerships",
]

export function Step5Interests() {
  const { formData, setField, toggleArrayField, next, back } = useDNA()
  const canNext = formData.s5_podcastCategories.length > 0

  return (
    <StepCard>
      <StepHeader
        headline="Your Podcast Interests"
        sub="Tell us the kinds of shows, conversations, and opportunities that excite you most."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>21. What podcast categories interest you most? — pick up to 5</SectionLabel>
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
          <SectionLabel>22. What type of host conversations do you enjoy?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HOST_CONVERSATIONS.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s5_hostConversations === label}
                onClick={() => setField("s5_hostConversations", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>23. What audience size is most important to you?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AUDIENCE_SIZES.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s5_audienceSize === label}
                onClick={() => setField("s5_audienceSize", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>24. Which podcast formats fit you best? — pick up to 3</SectionLabel>
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

        <div>
          <SectionLabel>25. What types of podcast opportunities are you actively seeking? — pick all that apply</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {OPPORTUNITIES.map(o => (
              <TagPill
                key={o}
                label={o}
                selected={formData.s5_opportunitiesSeeking.includes(o)}
                onClick={() => toggleArrayField("s5_opportunitiesSeeking", o)}
              />
            ))}
          </div>
        </div>
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
