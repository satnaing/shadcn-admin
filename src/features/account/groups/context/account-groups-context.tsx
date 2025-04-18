import React, { useState, createContext, useContext } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { AccountGroup } from '../data/schema'

// 对话框类型
type AccountGroupsDialogType = 'add' | 'edit' | 'delete'

// 上下文类型
interface AccountGroupsContextType {
  open: AccountGroupsDialogType | null
  setOpen: (str: AccountGroupsDialogType | null) => void
  currentGroup: AccountGroup | null
  setCurrentGroup: React.Dispatch<React.SetStateAction<AccountGroup | null>>
}

// 创建上下文
const AccountGroupsContext = createContext<AccountGroupsContextType | null>(null)

// 上下文提供者Props类型
interface Props {
  children: React.ReactNode
}

// 上下文提供者组件
export default function AccountGroupsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<AccountGroupsDialogType>(null)
  const [currentGroup, setCurrentGroup] = useState<AccountGroup | null>(null)

  return (
    <AccountGroupsContext.Provider value={{ open, setOpen, currentGroup, setCurrentGroup }}>
      {children}
    </AccountGroupsContext.Provider>
  )
}

// 自定义Hook，用于访问上下文
export const useAccountGroupsContext = () => {
  const accountGroupsContext = useContext(AccountGroupsContext)

  if (!accountGroupsContext) {
    throw new Error('useAccountGroupsContext 必须在 AccountGroupsProvider 内部使用')
  }

  return accountGroupsContext
} 