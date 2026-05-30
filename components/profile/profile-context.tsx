"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react"
import {
  type CreatorFormData,
  MOCK_CREATOR,
} from "@/components/profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   ProfileContext — edit-mode state + form draft management.
   Replace MOCK_CREATOR with a real session/API fetch when ready.
   ═══════════════════════════════════════════════════════════ */

interface ProfileContextValue {
  /* Saved (committed) creator data */
  creator:    CreatorFormData

  /* Edit mode */
  isEditing:  boolean
  startEdit:  () => void
  cancelEdit: () => void
  saveEdit:   () => void

  /* Draft form data (only active during edit mode) */
  draft:      CreatorFormData
  setDraft:   (partial: Partial<CreatorFormData>) => void

  /* Topic + keyword helpers */
  addTopic:     (t: string)   => void
  removeTopic:  (t: string)   => void
  addKeyword:   (k: string)   => void
  removeKeyword:(k: string)   => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [creator,   setCreator]   = useState<CreatorFormData>(MOCK_CREATOR)
  const [isEditing, setIsEditing] = useState(false)
  const [draft,     setDraftState] = useState<CreatorFormData>(MOCK_CREATOR)

  const startEdit  = useCallback(() => {
    setDraftState(creator)
    setIsEditing(true)
  }, [creator])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
  }, [])

  const saveEdit   = useCallback(() => {
    setCreator(draft)
    setIsEditing(false)
  }, [draft])

  const setDraft = useCallback((partial: Partial<CreatorFormData>) => {
    setDraftState(prev => ({ ...prev, ...partial }))
  }, [])

  const addTopic    = useCallback((t: string) => {
    setDraftState(prev => ({
      ...prev,
      topics: prev.topics.includes(t) ? prev.topics : [...prev.topics, t],
    }))
  }, [])

  const removeTopic = useCallback((t: string) => {
    setDraftState(prev => ({ ...prev, topics: prev.topics.filter(x => x !== t) }))
  }, [])

  const addKeyword  = useCallback((k: string) => {
    setDraftState(prev => ({
      ...prev,
      keywords: prev.keywords.includes(k) ? prev.keywords : [...prev.keywords, k],
    }))
  }, [])

  const removeKeyword = useCallback((k: string) => {
    setDraftState(prev => ({ ...prev, keywords: prev.keywords.filter(x => x !== k) }))
  }, [])

  return (
    <ProfileContext.Provider value={{
      creator, isEditing,
      startEdit, cancelEdit, saveEdit,
      draft, setDraft,
      addTopic, removeTopic,
      addKeyword, removeKeyword,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within <ProfileProvider>")
  return ctx
}
