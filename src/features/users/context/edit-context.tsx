import React, { useState } from 'react'
import { UserEditType } from '../data/schema'

export type DetailType =
  | 'after_courses'
  | 'certificates'
  | 'activities'
  | 'field_training'
  | 'employment'
  | 'university'
  | 'military'
  | 'middle_school'

interface EditContextType {
  editingSection: DetailType | null
  setEditingSection: (str: DetailType | null) => void
  editData: UserEditType | null
  setEditData: (str: UserEditType | null) => void
}

const EditContext = React.createContext<EditContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function EditProvider({ children }: Props) {
  const [editingSection, setEditingSection] = useState<DetailType | null>(null)
  const [editData, setEditData] = useState<UserEditType | null>(null)

  return (
    <EditContext
      value={{
        editingSection,
        setEditingSection,
        editData,
        setEditData,
      }}
    >
      {children}
    </EditContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEditUser = () => {
  const editContext = React.useContext(EditContext)

  if (!editContext) {
    throw new Error('error')
  }

  return editContext
}
