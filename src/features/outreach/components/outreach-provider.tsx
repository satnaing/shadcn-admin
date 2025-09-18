import { createContext, use, useState } from 'react'
import type { CampaignContactTableRow } from '../data/schema'

type OpenState = 'view' | null

type OutreachContextType = {
  open: OpenState
  setOpen: (open: OpenState) => void
  currentOutreach: CampaignContactTableRow | null
  setCurrentOutreach: (outreach: CampaignContactTableRow | null) => void
}

const OutreachContext = createContext<OutreachContextType | undefined>(undefined)

export function OutreachProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<OpenState>(null)
  const [currentOutreach, setCurrentOutreach] = useState<CampaignContactTableRow | null>(null)

  return (
    <OutreachContext
      value={{
        open,
        setOpen,
        currentOutreach,
        setCurrentOutreach,
      }}
    >
      {children}
    </OutreachContext>
  )
}

export function useOutreach() {
  const context = use(OutreachContext)
  if (!context) {
    throw new Error('useOutreach must be used within an OutreachProvider')
  }
  return context
}
