import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Device } from '../data/schema'

type DevicesDialogType = 'add' | 'edit' | 'delete' | 'import'

interface DevicesContextType {
  open: DevicesDialogType | null
  setOpen: (str: DevicesDialogType | null) => void
  currentRow: Device | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Device | null>>
}

const DevicesContext = React.createContext<DevicesContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function UsersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<DevicesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Device | null>(null)

  return (
    <DevicesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DevicesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDevices = () => {
  const devicesContext = React.useContext(DevicesContext)

  if (!devicesContext) {
    throw new Error('useUsers has to be used within <DevicesContext>')
  }

  return devicesContext
}
