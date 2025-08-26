import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Execution } from '../data/schema'

export type ExecutionsDialogType = 'view' | 'cancel'

type ExecutionsContextType = {
  open: ExecutionsDialogType | null
  setOpen: (str: ExecutionsDialogType | null) => void
  currentExecution: Execution | null
  setCurrentExecution: React.Dispatch<React.SetStateAction<Execution | null>>
}

const ExecutionsContext = React.createContext<ExecutionsContextType | null>(null)

export function ExecutionsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ExecutionsDialogType>(null)
  const [currentExecution, setCurrentExecution] = useState<Execution | null>(null)

  return (
    <ExecutionsContext.Provider value={{ open, setOpen, currentExecution, setCurrentExecution }}>
      {children}
    </ExecutionsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useExecutions = () => {
  const executionsContext = React.useContext(ExecutionsContext)

  if (!executionsContext) {
    throw new Error('useExecutions has to be used within <ExecutionsContext>')
  }

  return executionsContext
}
