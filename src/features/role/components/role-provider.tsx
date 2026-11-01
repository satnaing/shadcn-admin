import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { RoleEntityInterface } from '../data/role.type'

type RoleDialogType = 'add' | 'edit' | 'delete'

type RoleContextType = {
  open: RoleDialogType | null
  setOpen: (str: RoleDialogType | null) => void
  currentRow: RoleEntityInterface | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<RoleEntityInterface | null>
  >
}

const RoleContext = React.createContext<RoleContextType | null>(null)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RoleDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RoleEntityInterface | null>(null)

  return (
    <RoleContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RoleContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRoleContext = () => {
  const context = React.useContext(RoleContext)

  if (!context) {
    throw new Error('useRoleContext has to be used within <RoleProvider>')
  }

  return context
}
