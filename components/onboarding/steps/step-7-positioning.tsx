"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, StepTextarea, StepNav } from "../dna-inputs"

const MISSIONS = [
  { label: "Empower individuals",      description: "Help people unlock their potential" },
  { label: "Disrupt an industry",      description: "Challenge the status quo and drive change" },
  { label: "Educate and inform",        description: "Spread knowledge and raise awareness" },
  { label: "Inspire action",           description: "Move people from thinking to doing" },
  { label: "Build community",          description: "Connect people around shared purpose" },
  { label: "Drive social change",      description: "Address systemic issues and inequality" },
  { label: "Grow businesses",          description: "Help others achieve commercial success" },
  { label: "Heal and support",         description: "Provide care, guidance, and restoration" },
]

const ARCHETYPES = [
  { emoji: "🧭", label: "The Mentor",       description: "You guide with wisdom and lived experience" },
  { emoji: "🔭", label: "The Visionary",    description: "You see what others don't and share it boldly" },
  { emoji: "⚡", label: "The Disruptor",    description: "You challenge norms and spark difficult conversations" },
  { emoji: "🏛️", label: "The Expert",       description: "You are the go-to authority on your topic" },
  { emoji: "📖", label: "The Storyteller",  description: "You move people through narrative and emotion" },
  { emoji: "🌱", label: "The Activist",     description: "You fight for something bigger than yourself" },
  { emoji: "💡", label: "The Innovator",    description: "You create new ideas, methods, and solutions" },
  { emoji: "🤝", label: "The Connector",    description: "You bridge communities and amplify others" },
]

export function Step7Positioning() {
  const { formData, setField, back, finish } = useDNA()
  const canFinish = formData.s7_missionCategory !== "" || formData.s7_centralMessage.trim().length >= 10

  return (
    <StepCard>
      <StepHeader
        headline="Your Creator Positioning"
        sub="The final layer — your mission, archetype, and the message you want to be known for."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>22. Which category best reflects your mission?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MISSIONS.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s7_missionCategory === label}
                onClick={() => setField("s7_missionCategory", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>23. Which creator archetype best fits you?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ARCHETYPES.map(({ emoji, label, description }) => (
              <SelectionCard
                key={label}
                emoji={emoji}
                label={label}
                description={description}
                selected={formData.s7_creatorArchetype === label}
                onClick={() => setField("s7_creatorArchetype", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>24. What is the central message behind your work?</SectionLabel>
          <StepTextarea
            value={formData.s7_centralMessage}
            onChange={v => setField("s7_centralMessage", v)}
            placeholder="If your entire body of work could be summed up in one core idea or belief, what would it be..."
            rows={3}
          />
        </div>

        <div>
          <SectionLabel>25. If listeners remembered only one thing about you, what should it be?</SectionLabel>
          <StepTextarea
            value={formData.s7_oneRememberedThing}
            onChange={v => setField("s7_oneRememberedThing", v)}
            placeholder="The single most powerful truth, idea, or feeling you want to leave behind in every conversation..."
            rows={3}
          />
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-primary font-semibold">You&apos;re done.</span> Click Generate My Profile and our AI will build your Creator Profile and surface your strongest podcast matches.
          </p>
        </div>
      </div>

      <StepNav canNext={canFinish} onBack={back} onNext={finish} isLast />
    </StepCard>
  )
}
