"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, StepTextarea, StepNav } from "../dna-inputs"

const AGE_GROUPS = [
  { label: "18 – 24",    description: "Gen Z — digital-native early explorers" },
  { label: "25 – 34",    description: "Millennials — ambitious and growth-focused" },
  { label: "35 – 44",    description: "Established professionals building legacy" },
  { label: "45 – 54",    description: "Senior leaders and experienced practitioners" },
  { label: "55+",        description: "Seasoned executives and life-phase transitioners" },
  { label: "All ages",   description: "Your message resonates across generations" },
]

const AUDIENCE_TYPES = [
  { emoji: "💻", label: "Online learners & course seekers",      description: "People who invest in digital education" },
  { emoji: "🏢", label: "Corporate professionals & executives",  description: "Employees and leaders in organizations" },
  { emoji: "📱", label: "Social media followers & fans",         description: "Community built through content" },
  { emoji: "📰", label: "Newsletter & blog readers",             description: "People who seek depth and thought" },
  { emoji: "🎤", label: "Event & conference attendees",          description: "In-person and virtual event audiences" },
  { emoji: "🌍", label: "General public & mass audiences",       description: "Broad appeal beyond a niche" },
]

export function Step3Audience() {
  const { formData, setField, next, back } = useDNA()
  const canNext = formData.s3_audienceBenefits.trim().length >= 10

  return (
    <StepCard>
      <StepHeader
        headline="Your Audience"
        sub="The clearer you are about who you serve, the more precisely we can match you."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>7. Who benefits most from your message?</SectionLabel>
          <StepTextarea
            value={formData.s3_audienceBenefits}
            onChange={v => setField("s3_audienceBenefits", v)}
            placeholder="Describe the specific person who gets the most value from what you share — their situation, mindset, and what they're going through..."
            rows={4}
          />
        </div>

        <div>
          <SectionLabel>8. What age group do you primarily serve?</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {AGE_GROUPS.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s3_ageGroup === label}
                onClick={() => setField("s3_ageGroup", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>9. What audience challenge are you most equipped to address?</SectionLabel>
          <StepTextarea
            value={formData.s3_audienceChallenge}
            onChange={v => setField("s3_audienceChallenge", v)}
            placeholder="What is the core struggle, pain point, or gap your audience faces that you are uniquely positioned to solve..."
            rows={3}
          />
        </div>

        <div>
          <SectionLabel>10. What type of audience engages most with your content?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AUDIENCE_TYPES.map(({ emoji, label, description }) => (
              <SelectionCard
                key={label}
                emoji={emoji}
                label={label}
                description={description}
                selected={formData.s3_audienceType === label}
                onClick={() => setField("s3_audienceType", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>11. What audience outcome do you help create?</SectionLabel>
          <StepTextarea
            value={formData.s3_audienceOutcome}
            onChange={v => setField("s3_audienceOutcome", v)}
            placeholder="What does your audience walk away with after working with you or consuming your content? Be specific about the transformation..."
            rows={3}
          />
        </div>
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
