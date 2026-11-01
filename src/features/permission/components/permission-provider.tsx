import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { PermissionEntityInterface } from '../data/permission.type'

type PermissionDialogType = 'add' | 'edit' | 'delete'

type PermissionContextType = {
  open: PermissionDialogType | null
  setOpen: (str: PermissionDialogType | null) => void
  currentRow: PermissionEntityInterface | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<PermissionEntityInterface | null>
  >
}

const PermissionContext = React.createContext<PermissionContextType | null>(
  null
)

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<PermissionDialogType>(null)
  const [currentRow, setCurrentRow] =
    useState<PermissionEntityInterface | null>(null)

  return (
    <PermissionContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PermissionContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePermissionContext = () => {
  const context = React.useContext(PermissionContext)

  if (!context) {
    throw new Error(
      'usePermissionContext has to be used within <PermissionProvider>'
    )
  }

  return context
}
