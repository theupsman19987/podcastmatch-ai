"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, MultiCard, StepTextarea, StepNav } from "../dna-inputs"

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

const CENTRAL_MESSAGES = [
  { label: "Sustainable success requires aligned systems",          description: "Success built on structure, not hustle" },
  { label: "Transformation is possible for anyone willing to act",  description: "Change is a decision, not a circumstance" },
  { label: "Authenticity is the most powerful competitive edge",    description: "Who you are is your greatest differentiator" },
  { label: "The gap between knowing and doing is where growth lives", description: "Action closes the loop that knowledge opens" },
  { label: "Leadership starts within before it scales outward",     description: "Inner alignment precedes external impact" },
  { label: "True health connects mind, body, and purpose",         description: "Wellness is a whole-person practice" },
  { label: "Your story is your most valuable brand asset",         description: "Lived experience creates irreplaceable authority" },
  { label: "Community and connection outperform competition",       description: "The strongest brands are built on trust and belonging" },
]

export function Step7Positioning() {
  const { formData, toggleArrayField, setField, back, finish } = useDNA()
  const canFinish = formData.s7_missionCategory.length > 0 || formData.s7_centralMessage.length > 0

  return (
    <StepCard>
      <StepHeader
        headline="Your Creator Positioning"
        sub="The final layer — your mission, archetype, and the message you want to be known for."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>22. Which categories best reflect your mission? — pick up to 2</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MISSIONS.map(({ label, description }) => (
              <MultiCard
                key={label}
                label={label}
                description={description}
                selected={formData.s7_missionCategory.includes(label)}
                onClick={() => toggleArrayField("s7_missionCategory", label, 2)}
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
          <SectionLabel>24. What is the central message behind your work? — pick up to 2</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CENTRAL_MESSAGES.map(({ label, description }) => (
              <MultiCard
                key={label}
                label={label}
                description={description}
                selected={formData.s7_centralMessage.includes(label)}
                onClick={() => toggleArrayField("s7_centralMessage", label, 2)}
              />
            ))}
          </div>
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
