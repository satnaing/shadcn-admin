import React from 'react'
import { Task } from '../data/schema'

export type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

interface TasksContextType {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

interface Props {
  children: React.ReactNode
  value: TasksContextType
}

export default function TasksContextProvider({ children, value }: Props) {
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasksContext = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error(
      'useTasksContext has to be used within <TasksContext.Provider>'
    )
  }

  return tasksContext
}
