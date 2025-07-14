// src/context/profile.context.tsx
'use client'

import * as React from 'react'
import { IProfile } from '@/features/linkedin-profile/interface/profile.interface'

// src/context/profile.context.tsx

// src/context/profile.context.tsx

interface ProfileContextType {
  activeProfile: IProfile | null
  setActiveProfile: (profile: IProfile) => void
}

const ProfileContext = React.createContext<ProfileContextType | undefined>(
  undefined
)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [activeProfile, setActiveProfile] = React.useState<IProfile | null>(
    null
  )

  return (
    <ProfileContext.Provider value={{ activeProfile, setActiveProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = React.useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
