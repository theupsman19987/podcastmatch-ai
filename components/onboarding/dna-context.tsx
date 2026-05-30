"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export const TOTAL_STEPS = 7

export interface DNAFormData {
  creatorType: string
  tagline: string
  expertise: string
  yearsInField: string
  targetAudience: string
  audienceSize: string
  communicationStyle: string
  energyLevel: string
  podcastFormats: string[]
  passionTopics: string[]
  mediaExperience: string[]
  goals: string[]
  uniquePerspective: string
  keyTakeaway: string
}

const INITIAL: DNAFormData = {
  creatorType: "",
  tagline: "",
  expertise: "",
  yearsInField: "",
  targetAudience: "",
  audienceSize: "",
  communicationStyle: "",
  energyLevel: "",
  podcastFormats: [],
  passionTopics: [],
  mediaExperience: [],
  goals: [],
  uniquePerspective: "",
  keyTakeaway: "",
}

interface DNAContextValue {
  step: number
  direction: number
  formData: DNAFormData
  complete: boolean
  setField: <K extends keyof DNAFormData>(key: K, value: DNAFormData[K]) => void
  toggleArrayField: (key: "podcastFormats" | "passionTopics" | "mediaExperience" | "goals", value: string, max?: number) => void
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

  const toggleArrayField = useCallback(
    (key: "podcastFormats" | "passionTopics" | "mediaExperience" | "goals", value: string, max?: number) => {
      setFormData(prev => {
        const arr = prev[key] as string[]
        if (arr.includes(value)) return { ...prev, [key]: arr.filter(v => v !== value) }
        if (max && arr.length >= max) return prev
        return { ...prev, [key]: [...arr, value] }
      })
    },
    []
  )

  const next = useCallback(() => {
    setDirection(1)
    setStep(s => Math.min(s + 1, TOTAL_STEPS))
  }, [])

  const back = useCallback(() => {
    setDirection(-1)
    setStep(s => Math.max(s - 1, 1))
  }, [])

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
