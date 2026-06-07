"use client"

import { useDNA } from "../dna-context"
import { StepCard, StepHeader, SectionLabel, SelectionCard, StepNav } from "../dna-inputs"

const PODCAST_EXPERIENCE = [
  { label: "Yes, multiple times",             description: "I'm a seasoned podcast guest" },
  { label: "Yes, a few times",                description: "I have some experience as a guest" },
  { label: "Yes, once",                       description: "I've done it once before" },
  { label: "Not yet, but I'm ready",          description: "First time, fully prepared to show up" },
  { label: "No — podcasts will be my start",  description: "This is my media debut" },
]

const SPEAKING_EXPERIENCE = [
  { label: "Yes, regularly",          description: "Conferences, stages, and events frequently" },
  { label: "Yes, occasionally",       description: "A few events or panels under my belt" },
  { label: "Yes, virtually / online", description: "Webinars, summits, and virtual stages" },
  { label: "Informally only",         description: "Meetings, workshops, or community talks" },
  { label: "No formal experience yet", description: "Podcast appearances will be my foundation" },
]

const PUBLISHED_WORK = [
  { label: "Published book(s)",         description: "Traditionally or self-published" },
  { label: "Online course(s)",          description: "A structured curriculum or program" },
  { label: "Coaching program",          description: "A formal client engagement system" },
  { label: "Proprietary framework",     description: "A named method or signature process" },
  { label: "Multiple of the above",     description: "I have a full ecosystem of work" },
  { label: "In progress — not yet",     description: "Coming soon" },
  { label: "None yet",                  description: "The podcast will be part of building this" },
]

const SOCIAL_ACTIVITY = [
  { label: "Very active — daily posting",     description: "Consistent presence across platforms" },
  { label: "Active — several times a week",   description: "Regular engagement and content" },
  { label: "Moderate — weekly posting",       description: "Consistent but not daily" },
  { label: "Occasional — monthly or less",    description: "Posting when inspired or relevant" },
  { label: "Minimal / not currently active",  description: "Building presence is part of my plan" },
]

const READINESS = [
  { label: "Ready immediately",       description: "I'm available and prepared right now" },
  { label: "Ready within 1 month",    description: "A few things to line up first" },
  { label: "Ready within 3 months",   description: "I'm in preparation mode" },
  { label: "Still preparing",         description: "I want to learn before I apply" },
  { label: "Exploring my options",    description: "Just researching what's possible" },
]

export function Step6Visibility() {
  const { formData, setField, next, back } = useDNA()
  const canNext = formData.s6_previousPodcasts !== ""

  return (
    <StepCard>
      <StepHeader
        headline="Your Visibility & Experience"
        sub="Help us understand where you are today so we can match you with the right opportunities."
      />

      <div className="space-y-6">
        <div>
          <SectionLabel>17. Have you previously appeared on podcasts?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PODCAST_EXPERIENCE.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s6_previousPodcasts === label}
                onClick={() => setField("s6_previousPodcasts", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>18. Have you spoken publicly before?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPEAKING_EXPERIENCE.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s6_publicSpeaking === label}
                onClick={() => setField("s6_publicSpeaking", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>19. Do you have a published book, program, course, or framework?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PUBLISHED_WORK.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s6_publishedWork === label}
                onClick={() => setField("s6_publishedWork", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>20. How active are you on social media?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SOCIAL_ACTIVITY.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s6_socialMediaActivity === label}
                onClick={() => setField("s6_socialMediaActivity", label)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>21. How ready are you to pursue podcast opportunities right now?</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {READINESS.map(({ label, description }) => (
              <SelectionCard
                key={label}
                label={label}
                description={description}
                selected={formData.s6_readiness === label}
                onClick={() => setField("s6_readiness", label)}
              />
            ))}
          </div>
        </div>
      </div>

      <StepNav canNext={canNext} onBack={back} onNext={next} />
    </StepCard>
  )
}
