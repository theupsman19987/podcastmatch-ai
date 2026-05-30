"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, StepTextarea, StepNav } from "../dna-inputs"

const TITLES = [
  "Author", "Speaker", "Coach", "Consultant",
  "CEO / Founder", "Expert", "Educator", "Podcaster",
  "Researcher", "Activist", "Therapist / Clinician", "Artist / Creative",
]

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

const TRANSFORMATIONS = [
  "From stuck to unstoppable",
  "From confused to crystal clear",
  "From financially struggling to free",
  "From burned out to energized",
  "From unknown to highly visible",
  "From novice to recognized expert",
  "From isolated to deeply connected",
  "From reactive to fully in control",
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

const INFLUENCE_TYPES = [
  { label: "Thought leadership",       description: "Shaping ideas in your industry" },
  { label: "Community leadership",     description: "Building and galvanizing a group" },
  { label: "Industry authority",       description: "Being the recognized expert others cite" },
  { label: "Cultural impact",          description: "Shifting mindsets at a societal level" },
  { label: "Spiritual influence",      description: "Guiding people's inner life and purpose" },
  { label: "Creative influence",       description: "Inspiring through art, story, and expression" },
]

const LONGTERM_GOALS = [
  { label: "NYT Bestseller or major publication", description: "Become a recognized published author" },
  { label: "TED Talk or flagship keynote",        description: "Speak on the world's biggest stages" },
  { label: "National media presence",             description: "TV, major press, and mainstream recognition" },
  { label: "Top podcast circuit",                 description: "Become a sought-after recurring guest" },
  { label: "Viral content & mass reach",          description: "Moments that spread beyond your network" },
  { label: "Building a movement",                 description: "Creating lasting cultural or social change" },
]

export function Step7Positioning() {
  const { formData, setField, back, finish } = useDNA()
  const canFinish = formData.s7_title !== "" || formData.s7_knownFor.trim().length >= 10

  return (
    <StepCard>
      <StepHeader
        headline="Your Creator Positioning"
        sub="The final layer — your identity, mission, and long-term vision as a creator."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>31. Which title best describes you?</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TITLES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setField("s7_title", t)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold border text-center transition-all duration-200 ${
                  formData.s7_title === t
                    ? "border-primary/60 bg-primary/5 text-foreground shadow-[0_0_12px_oklch(var(--primary)/0.12)]"
                    : "border-border/40 bg-card/50 text-foreground/70 hover:border-border/70 hover:text-foreground/90"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>32. Which category best reflects your mission?</SectionLabel>
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
          <SectionLabel>33. Which audience transformation best represents your work?</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {TRANSFORMATIONS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setField("s7_audienceTransformation", t)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  formData.s7_audienceTransformation === t
                    ? "bg-primary/15 border-primary/50 text-primary shadow-[0_0_8px_oklch(var(--primary)/0.15)]"
                    : "bg-card/50 border-border/40 text-muted-foreground hover:border-border/70 hover:text-foreground/80"
                }`}
              >
                {formData.s7_audienceTransformation === t && <span className="mr-1 text-xs">✓</span>}
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>34. What do you want to become known for?</SectionLabel>
          <StepTextarea
            value={formData.s7_knownFor}
            onChange={v => setField("s7_knownFor", v)}
            placeholder="Describe the specific reputation, expertise, or legacy you are working to build..."
            rows={3}
          />
        </div>

        <div>
          <SectionLabel>35. Which creator archetype best fits you?</SectionLabel>
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
          <SectionLabel>36. What type of influence are you trying to build?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INFLUENCE_TYPES.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s7_influenceType === label}
                onClick={() => setField("s7_influenceType", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>37. What long-term visibility goal is most important?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LONGTERM_GOALS.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s7_longTermGoal === label}
                onClick={() => setField("s7_longTermGoal", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>38. What makes your story unique?</SectionLabel>
          <StepTextarea
            value={formData.s7_uniqueStory}
            onChange={v => setField("s7_uniqueStory", v)}
            placeholder="What is the combination of experiences, perspective, and path that only you have lived..."
            rows={3}
          />
        </div>

        <div>
          <SectionLabel>39. What is the central message behind your work?</SectionLabel>
          <StepTextarea
            value={formData.s7_centralMessage}
            onChange={v => setField("s7_centralMessage", v)}
            placeholder="If your entire body of work could be summed up in one core idea or belief, what would it be..."
            rows={3}
          />
        </div>

        <div>
          <SectionLabel>40. If listeners remembered only one thing about you, what should it be?</SectionLabel>
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
