import React, { useState, useEffect, useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { type ExecutionInfoFragment } from '../graphql/operations.generated'

export type ExecutionsDialogType = 'view' | 'cancel'

type ExecutionsContextType = {
  open: ExecutionsDialogType | null
  setOpen: (str: ExecutionsDialogType | null) => void
  currentExecution: ExecutionInfoFragment | null
  setCurrentExecution: React.Dispatch<React.SetStateAction<ExecutionInfoFragment | null>>
}

const ExecutionsContext = React.createContext<ExecutionsContextType | null>(null)

const route = getRouteApi('/activity/')

export function ExecutionsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<ExecutionsDialogType | null>(null)
  const [currentExecution, setCurrentExecution] = useState<ExecutionInfoFragment | null>(null)
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Open modal if executionId is in URL
  useEffect(() => {
    if (search.executionId) {
      setOpen('view')
    }
  }, [search.executionId])

  const handleSetOpen = React.useCallback(
    (dialogType: ExecutionsDialogType | null) => {
      setOpen(dialogType)

      // Remove executionId from URL when closing
      if (!dialogType && search.executionId) {
        navigate({
          search: (prev) => ({
            ...prev,
            executionId: undefined,
          }),
        })
      }
    },
    [navigate, search.executionId]
  )

  const contextValue = useMemo(
    () => ({
      open,
      setOpen: handleSetOpen,
      currentExecution,
      setCurrentExecution,
    }),
    [open, currentExecution, handleSetOpen, setCurrentExecution]
  )

  return <ExecutionsContext value={contextValue}>{children}</ExecutionsContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useExecutions = () => {
  const executionsContext = React.use(ExecutionsContext)

  if (!executionsContext) {
    throw new Error('useExecutions has to be used within <ExecutionsContext>')
  }

  return executionsContext
}
