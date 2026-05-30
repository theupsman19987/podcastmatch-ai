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

const EMOTIONAL_RESPONSES = [
  "Inspired to take action",
  "Educated and informed",
  "Empowered and capable",
  "Challenged and disrupted",
  "Motivated and energized",
  "Deeply understood",
  "Hopeful and optimistic",
  "Confident and clear",
]

const COMM_DESCRIPTIONS = [
  { label: "Clear and direct",         description: "Straight to the point, no ambiguity" },
  { label: "Warm and relatable",       description: "Approachable, human, and inclusive" },
  { label: "Bold and provocative",     description: "Willing to challenge and stir thinking" },
  { label: "Deep and thoughtful",      description: "Nuanced, reflective, and considered" },
  { label: "Energetic and dynamic",    description: "High-energy, expressive, and electric" },
  { label: "Calm and measured",        description: "Steady presence that commands attention" },
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
          <SectionLabel>16. How would you describe your speaking style?</SectionLabel>
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
          <SectionLabel>17. Which best describes how you teach?</SectionLabel>
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
          <SectionLabel>18. What emotional response do you want audiences to experience?</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {EMOTIONAL_RESPONSES.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setField("s4_emotionalResponse", r)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  formData.s4_emotionalResponse === r
                    ? "bg-primary/15 border-primary/50 text-primary shadow-[0_0_8px_oklch(var(--primary)/0.15)]"
                    : "bg-card/50 border-border/40 text-muted-foreground hover:border-border/70 hover:text-foreground/80"
                }`}
              >
                {formData.s4_emotionalResponse === r && <span className="mr-1 text-xs">✓</span>}
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>19. How do people typically describe your communication style?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMM_DESCRIPTIONS.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s4_communicationDescription === label}
                onClick={() => setField("s4_communicationDescription", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>20. What makes your voice different from others in your field?</SectionLabel>
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
