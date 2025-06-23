"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"

// Define the shape of our onboarding data
export interface OnboardingData {
  // Extension step
  isExtensionInstalled: boolean

  // LinkedIn step
  isLinkedInConnected: boolean
  userProfile: {
    name: string
    title: string
    avatar: string
  } | null

  // Post settings step
  keywords: string[]
  commentsPerDay: number
  authorTitle: string
  geography: string

  // Comment settings step
  aboutProfile: string
  additionalRules: string
  useEmojis: boolean
  useExclamations: boolean
  commentStyle: string

  // Demo step
  autoApprove: boolean
  authorTitles: string[]
}

// Define the context shape
interface OnboardingContextType {
  data: OnboardingData
  updateData: (newData: Partial<OnboardingData>) => void
  resetData: () => void
  completedSteps: string[]
  markStepCompleted: (step: string) => void
  isStepCompleted: (step: string) => boolean
}

// Default values for the onboarding data
const defaultOnboardingData: OnboardingData = {
  // Extension step
  isExtensionInstalled: false,

  // LinkedIn step
  isLinkedInConnected: false,
  userProfile: null,

  // Post settings step
  keywords: [],
  commentsPerDay: 10,
  authorTitle: "generic",
  geography: "global",

  // Comment settings step
  aboutProfile: "",
  additionalRules: "",
  useEmojis: true,
  useExclamations: true,
  commentStyle: "balanced",

  // Demo step
  autoApprove: false,
  authorTitles:[]
}

// Create the context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

interface OnboardingProviderProps {
  children: ReactNode
}

// Provider component
export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  // Update data function
  const updateData = useCallback((newData: Partial<OnboardingData>) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,
    }))
  }, [])

  // Reset data function
  const resetData = useCallback(() => {
    setData(defaultOnboardingData)
    setCompletedSteps([])
  }, [])

  // Mark step as completed
  const markStepCompleted = useCallback(
    (step: string) => {
      if (!completedSteps.includes(step)) {
        setCompletedSteps((prev) => [...prev, step])
      }
    },
    [completedSteps],
  )

  // Check if step is completed
  const isStepCompleted = useCallback((step: string) => completedSteps.includes(step), [completedSteps])

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        resetData,
        completedSteps,
        markStepCompleted,
        isStepCompleted,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

// Custom hook to use the onboarding context
export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
