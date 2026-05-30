"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export const TOTAL_STEPS = 7

export type ArrayField = "s1_podcastMotivation" | "s5_podcastCategories" | "s5_podcastFormats" | "s5_opportunitiesSeeking"

export interface DNAFormData {
  // Step 1 — Your Story
  s1_lifeExperience: string
  s1_challengeOvercome: string
  s1_personalTransformation: string
  s1_podcastMotivation: string[]
  s1_messageImpact: string

  // Step 2 — Your Expertise
  s2_primaryTopic: string
  s2_speakForHour: string
  s2_problemSolved: string
  s2_personalResults: string
  s2_expertiseCategory: string

  // Step 3 — Your Audience
  s3_audienceBenefits: string
  s3_ageGroup: string
  s3_audienceChallenge: string
  s3_audienceType: string
  s3_audienceOutcome: string

  // Step 4 — Communication Style
  s4_speakingStyle: string
  s4_teachingStyle: string
  s4_emotionalResponse: string
  s4_communicationDescription: string
  s4_uniqueVoice: string

  // Step 5 — Podcast Interests
  s5_podcastCategories: string[]
  s5_hostConversations: string
  s5_audienceSize: string
  s5_podcastFormats: string[]
  s5_opportunitiesSeeking: string[]

  // Step 6 — Visibility & Experience
  s6_previousPodcasts: string
  s6_publicSpeaking: string
  s6_publishedWork: string
  s6_socialMediaActivity: string
  s6_readiness: string

  // Step 7 — Creator Positioning
  s7_title: string
  s7_missionCategory: string
  s7_audienceTransformation: string
  s7_knownFor: string
  s7_creatorArchetype: string
  s7_influenceType: string
  s7_longTermGoal: string
  s7_uniqueStory: string
  s7_centralMessage: string
  s7_oneRememberedThing: string
}

const INITIAL: DNAFormData = {
  s1_lifeExperience: "",
  s1_challengeOvercome: "",
  s1_personalTransformation: "",
  s1_podcastMotivation: [],
  s1_messageImpact: "",
  s2_primaryTopic: "",
  s2_speakForHour: "",
  s2_problemSolved: "",
  s2_personalResults: "",
  s2_expertiseCategory: "",
  s3_audienceBenefits: "",
  s3_ageGroup: "",
  s3_audienceChallenge: "",
  s3_audienceType: "",
  s3_audienceOutcome: "",
  s4_speakingStyle: "",
  s4_teachingStyle: "",
  s4_emotionalResponse: "",
  s4_communicationDescription: "",
  s4_uniqueVoice: "",
  s5_podcastCategories: [],
  s5_hostConversations: "",
  s5_audienceSize: "",
  s5_podcastFormats: [],
  s5_opportunitiesSeeking: [],
  s6_previousPodcasts: "",
  s6_publicSpeaking: "",
  s6_publishedWork: "",
  s6_socialMediaActivity: "",
  s6_readiness: "",
  s7_title: "",
  s7_missionCategory: "",
  s7_audienceTransformation: "",
  s7_knownFor: "",
  s7_creatorArchetype: "",
  s7_influenceType: "",
  s7_longTermGoal: "",
  s7_uniqueStory: "",
  s7_centralMessage: "",
  s7_oneRememberedThing: "",
}

interface DNAContextValue {
  step: number
  direction: number
  formData: DNAFormData
  complete: boolean
  setField: <K extends keyof DNAFormData>(key: K, value: DNAFormData[K]) => void
  toggleArrayField: (key: ArrayField, value: string, max?: number) => void
  next: () => void
  back: () => void
  finish: () => void
}

const DNAContext = createContext<DNAContextValue | null>(null)

export function DNAProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<DNAFormData>(INITIAL)
  const [complete, setComplete] = useState(false)

  const setField = useCallback(<K extends keyof DNAFormData>(key: K, value: DNAFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleArrayField = useCallback((key: ArrayField, value: string, max?: number) => {
    setFormData(prev => {
      const arr = prev[key] as string[]
      if (arr.includes(value)) return { ...prev, [key]: arr.filter(v => v !== value) }
      if (max && arr.length >= max) return prev
      return { ...prev, [key]: [...arr, value] }
    })
  }, [])

  const next = useCallback(() => { setDirection(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)) }, [])
  const back = useCallback(() => { setDirection(-1); setStep(s => Math.max(s - 1, 1)) }, [])
  const finish = useCallback(() => setComplete(true), [])

  return (
    <DNAContext.Provider value={{ step, direction, formData, complete, setField, toggleArrayField, next, back, finish }}>
      {children}
    </DNAContext.Provider>
  )
}

export function useDNA() {
  const ctx = useContext(DNAContext)
  if (!ctx) throw new Error("useDNA must be used within DNAProvider")
  return ctx
}
