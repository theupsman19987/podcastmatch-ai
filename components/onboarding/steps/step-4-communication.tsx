"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, StepTextarea, StepNav } from "../dna-inputs"

const SPEAKING_STYLES = [
  { emoji: "💬", label: "Conversational",      description: "Natural, casual, and deeply relatable" },
  { emoji: "📐", label: "Educational",          description: "Structured, clear, and information-rich" },
  { emoji: "🔥", label: "Inspirational",        description: "Emotionally charged and movement-building" },
  { emoji: "📊", label: "Analytical",           description: "Data-driven, logical, and evidence-based" },
  { emoji: "📖", label: "Storytelling",         description: "Narrative-led with vivid personal examples" },
  { emoji: "⚡", label: "Direct & Concise",     description: "Sharp, punchy, and no-fluff delivery" },
]

const TEACHING_STYLES = [
  { label: "Step-by-step frameworks",      description: "I give people a clear repeatable process" },
  { label: "Stories and examples",         description: "I make concepts stick through narrative" },
  { label: "Data and evidence",            description: "I back every point with proof and research" },
  { label: "Questions and dialogue",       description: "I draw out insight through conversation" },
  { label: "Live demonstration",           description: "I show rather than just tell" },
  { label: "Metaphors and analogies",      description: "I translate complex ideas into simple images" },
]

export function Step4Communication() {
  const { formData, setField, next, back } = useDNA()
  const canNext = formData.s4_speakingStyle !== ""

  return (
    <StepCard>
      <StepHeader
        headline="Your Communication Style"
        sub="How you show up in conversations determines the podcast hosts and formats that fit you best."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>12. How would you describe your speaking style?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPEAKING_STYLES.map(({ emoji, label, description }) => (
              <SelectionCard
                key={label}
                emoji={emoji}
                label={label}
                description={description}
                selected={formData.s4_speakingStyle === label}
                onClick={() => setField("s4_speakingStyle", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>13. Which best describes how you teach?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEACHING_STYLES.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s4_teachingStyle === label}
                onClick={() => setField("s4_teachingStyle", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>14. What makes your voice different from others in your field?</SectionLabel>
          <StepTextarea
            value={formData.s4_uniqueVoice}
            onChange={v => setField("s4_uniqueVoice", v)}
            placeholder="What do you say, see, or deliver that nobody else in your space does quite the same way..."
            rows={3}
          />
        </div>
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
