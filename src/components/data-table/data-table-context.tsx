import React, { useState, createContext, useContext } from 'react'
import useDialogState from '@/hooks/use-dialog-state'


// 上下文类型
interface DataTableContextType<T,D extends string | boolean> {
  open: D | null
  setOpen: (str: D | null) => void
  current: T | null
  setCurrent: React.Dispatch<React.SetStateAction<T | null>>
}

// 创建上下文
const DataTablContext = createContext<DataTableContextType<T,D> | null>(null)

// 上下文提供者Props类型
interface Props {
  children: React.ReactNode
}

// 上下文提供者组件
export default function DataTableProvider<T,D extends string | boolean>({ children }: Props) {
  const [open, setOpen] = useDialogState<D>(null)
  const [current, setCurrent] = useState<T | null>(null)

  return (
    <DataTablContext.Provider 
      value={{ 
        open, 
        setOpen, 
        current,
        setCurrent
      }}
    >
      {children}
    </DataTablContext.Provider>
  )
}

// 自定义Hook，用于访问上下文
export const useDataTableContext = () => {
  const dataTableContext = useContext(DataTablContext)

  if (!dataTableContext) {
    throw new Error('useDataTableContext 必须在 DataTableProvider 内部使用')
  }

  return dataTableContext
} 