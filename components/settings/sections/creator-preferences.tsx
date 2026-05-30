"use client"

import { useState } from "react"
import { SlidersHorizontal, Plus, X } from "lucide-react"
import { SettingsCard, SectionHeader, FieldRow, Chip, SaveButton } from "../settings-ui"
import {
  MOCK_PREFS, ALL_PODCAST_CATEGORIES, ALL_FORMATS, VISIBILITY_GOALS,
} from "../settings-mock"
import type { SaveState } from "../settings-ui"

type SaveStateLoc = "idle" | "saving" | "saved"

export function CreatorPreferences() {
  const [categories,   setCategories]   = useState<string[]>(MOCK_PREFS.categories)
  const [formats,      setFormats]      = useState<string[]>(MOCK_PREFS.formats)
  const [topics,       setTopics]       = useState<string[]>(MOCK_PREFS.speakingTopics)
  const [interests,    setInterests]    = useState<string[]>(MOCK_PREFS.audienceInterests)
  const [visGoal,      setVisGoal]      = useState(MOCK_PREFS.visibilityGoal)
  const [topicInput,   setTopicInput]   = useState("")
  const [interestInput,setInterestInput]= useState("")
  const [saveState, setSaveState] = useState<SaveStateLoc>("idle")

  function toggle(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  function addTag(arr: string[], setArr: (v: string[]) => void, val: string, clear: () => void) {
    const v = val.trim()
    if (v && !arr.includes(v)) setArr([...arr, v])
    clear()
  }

  function removeTag(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.filter(x => x !== val))
  }

  function handleSave() {
    setSaveState("saving")
    setTimeout(() => { setSaveState("saved"); setTimeout(() => setSaveState("idle"), 2000) }, 900)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Categories */}
      <SettingsCard delay={0}>
        <div className="p-6 md:p-8">
          <SectionHeader
            icon={<SlidersHorizontal className="w-4 h-4 text-primary" />}
            title="Creator Preferences"
            description="Customize your podcast matching criteria"
          />
          <FieldRow label="Podcast Categories" hint="Select up to 6 categories">
            <div className="flex flex-wrap gap-2">
              {ALL_PODCAST_CATEGORIES.map(cat => (
                <Chip
                  key={cat} label={cat}
                  active={categories.includes(cat)}
                  onToggle={() => toggle(categories, setCategories, cat)}
                />
              ))}
            </div>
          </FieldRow>
        </div>
      </SettingsCard>

      {/* Formats */}
      <SettingsCard delay={0.05}>
        <div className="p-6 md:p-8">
          <FieldRow label="Podcast Formats" hint="What show styles do you prefer?">
            <div className="flex flex-wrap gap-2">
              {ALL_FORMATS.map(fmt => (
                <Chip
                  key={fmt} label={fmt}
                  active={formats.includes(fmt)}
                  onToggle={() => toggle(formats, setFormats, fmt)}
                />
              ))}
            </div>
          </FieldRow>
        </div>
      </SettingsCard>

      {/* Visibility Goal */}
      <SettingsCard delay={0.1}>
        <div className="p-6 md:p-8">
          <FieldRow label="Visibility Goal" hint="What is your primary goal for podcast appearances?">
            <div className="flex flex-wrap gap-2">
              {VISIBILITY_GOALS.map(goal => (
                <button
                  key={goal}
                  onClick={() => setVisGoal(goal)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                    visGoal === goal
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-card/40 border-border/40 text-muted-foreground hover:border-primary/25 hover:text-foreground"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </FieldRow>
        </div>
      </SettingsCard>

      {/* Speaking Topics */}
      <SettingsCard delay={0.15}>
        <div className="p-6 md:p-8">
          <FieldRow label="Speaking Topics" hint="Topics you speak about on podcasts">
            <div className="flex flex-wrap gap-2 mb-3">
              {topics.map(t => (
                <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 border border-primary/25 text-primary">
                  {t}
                  <button onClick={() => removeTag(topics, setTopics, t)} className="hover:text-primary/60">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTag(topics, setTopics, topicInput, () => setTopicInput(""))}
                placeholder="Add a topic and press Enter…"
                className="flex-1 px-3.5 py-2 rounded-xl bg-card/60 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={() => addTag(topics, setTopics, topicInput, () => setTopicInput(""))}
                className="px-3 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </FieldRow>

          <FieldRow label="Audience Interests" hint="What your audience cares about">
            <div className="flex flex-wrap gap-2 mb-3">
              {interests.map(t => (
                <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-card/60 border border-border/40 text-foreground/80">
                  {t}
                  <button onClick={() => removeTag(interests, setInterests, t)} className="hover:text-muted-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={interestInput}
                onChange={e => setInterestInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTag(interests, setInterests, interestInput, () => setInterestInput(""))}
                placeholder="Add an interest and press Enter…"
                className="flex-1 px-3.5 py-2 rounded-xl bg-card/60 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={() => addTag(interests, setInterests, interestInput, () => setInterestInput(""))}
                className="px-3 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </FieldRow>
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <SaveButton state={saveState as SaveState} onClick={handleSave} />
      </div>
    </div>
  )
}
