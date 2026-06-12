"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, MultiCard, TagPill, StepTextarea, StepNav } from "../dna-inputs"

const TOPICS = [
  { emoji: "💼", label: "Business & Entrepreneurship" },
  { emoji: "⚡", label: "Technology & Innovation" },
  { emoji: "🌿", label: "Health & Wellness" },
  { emoji: "🧠", label: "Personal Development" },
  { emoji: "📈", label: "Finance & Investing" },
  { emoji: "🏆", label: "Leadership & Management" },
  { emoji: "📣", label: "Marketing & Branding" },
  { emoji: "🔬", label: "Science & Research" },
  { emoji: "🎨", label: "Arts & Culture" },
  { emoji: "🕊️", label: "Spirituality & Mindfulness" },
  { emoji: "👨‍👩‍👧", label: "Parenting & Family" },
  { emoji: "📖", label: "Education & Learning" },
]

const CATEGORIES = [
  { emoji: "🎓", label: "Industry Expert",    description: "Deep specialist knowledge in your field" },
  { emoji: "📚", label: "Author / Creator",   description: "You've published books, courses, or content" },
  { emoji: "🧭", label: "Coach / Mentor",     description: "You guide and develop others" },
  { emoji: "💡", label: "Thought Leader",     description: "You shape ideas and perspectives at scale" },
  { emoji: "🚀", label: "Entrepreneur",       description: "You build and operate ventures" },
  { emoji: "🔬", label: "Researcher / Academic", description: "Evidence-based insights and data" },
  { emoji: "🏛️", label: "Executive / Leader", description: "C-suite, board, or senior leadership" },
  { emoji: "🌱", label: "Practitioner",       description: "You apply your craft hands-on every day" },
]

export function Step2Expertise() {
  const { formData, setField, toggleArrayField, next, back } = useDNA()
  const canNext = formData.s2_primaryTopic.length > 0

  return (
    <StepCard>
      <StepHeader
        headline="Your Expertise"
        sub="Define your knowledge, your craft, and the results you create."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>2. Which topics best represent your primary expertise? — pick up to 2</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {TOPICS.map(({ emoji, label }) => (
              <MultiCard
                key={label}
                emoji={emoji}
                label={label}
                selected={formData.s2_primaryTopic.includes(label)}
                onClick={() => toggleArrayField("s2_primaryTopic", label, 2)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>3. What subjects could you speak about for an hour without preparation? — pick up to 2</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(({ label }) => (
              <TagPill
                key={label}
                label={label}
                selected={formData.s2_speakForHour.includes(label)}
                onClick={() => toggleArrayField("s2_speakForHour", label, 2)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>4. What problem do you help people solve?</SectionLabel>
          <StepTextarea
            value={formData.s2_problemSolved}
            onChange={v => setField("s2_problemSolved", v)}
            placeholder="Describe the specific pain, challenge, or obstacle your expertise addresses..."
            rows={3}
          />
        </div>

        <div>
          <SectionLabel>5. What results have you personally achieved in this area?</SectionLabel>
          <StepTextarea
            value={formData.s2_personalResults}
            onChange={v => setField("s2_personalResults", v)}
            placeholder="Share measurable wins, milestones, or transformations you've experienced yourself..."
            rows={3}
          />
        </div>

        <div>
          <SectionLabel>6. Which expertise category best describes you?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map(({ emoji, label, description }) => (
              <SelectionCard
                key={label}
                emoji={emoji}
                label={label}
                description={description}
                selected={formData.s2_expertiseCategory === label}
                onClick={() => setField("s2_expertiseCategory", label)}
              />
            ))}
          </div>
        </div>
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
