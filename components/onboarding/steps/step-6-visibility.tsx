"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, MultiCard, TagPill, StepNav } from "../dna-inputs"

const EXPERIENCE = [
  { emoji: "🎙️", label: "Podcast guest appearances",          description: "You've been a guest on one or more shows" },
  { emoji: "🎤", label: "Conference & event speaking",         description: "You've spoken at live events or summits" },
  { emoji: "📰", label: "Press & media interviews",            description: "You've been featured in publications or news" },
  { emoji: "📹", label: "Video & YouTube content",             description: "You create or appear in video content" },
  { emoji: "✍️", label: "Written articles & thought leadership", description: "You publish blogs, LinkedIn posts, or op-eds" },
  { emoji: "✨", label: "None yet — I'm just getting started", description: "This will be your launchpad into media" },
]

const GOALS = [
  "Build thought leadership", "Grow my audience", "Promote a book or course",
  "Find ideal clients", "Share an important message", "Network with other leaders",
  "Launch or grow a business", "Land speaking opportunities", "Establish media presence",
]

export function Step6Visibility() {
  const { formData, toggleArrayField, next, back } = useDNA()
  const canNext = formData.goals.length > 0

  return (
    <StepCard>
      <StepHeader
        headline="What's your visibility story?"
        sub="Share your media background and what you want podcast appearances to accomplish for you."
      />

      <SectionLabel>Your Media Experience — select all that apply</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {EXPERIENCE.map(({ emoji, label, description }) => (
          <MultiCard
            key={label}
            emoji={emoji}
            label={label}
            description={description}
            selected={formData.mediaExperience.includes(label)}
            onClick={() => toggleArrayField("mediaExperience", label)}
          />
        ))}
      </div>

      <SectionLabel>Your Top Goals — pick up to 3</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {GOALS.map(g => (
          <TagPill
            key={g}
            label={g}
            selected={formData.goals.includes(g)}
            onClick={() => toggleArrayField("goals", g, 3)}
          />
        ))}
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
