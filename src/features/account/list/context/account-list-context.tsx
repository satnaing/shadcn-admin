import React, { useState, createContext, useContext } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Account } from '../data/schema'

// 对话框类型
type AccountListDialogType = 'import' | 'delete' | 'updateGroup'

// 上下文类型
interface AccountListContextType {
  open: AccountListDialogType | null
  setOpen: (str: AccountListDialogType | null) => void
  current: Account | null
  setCurrent: React.Dispatch<React.SetStateAction<Account | null>>
}

// 创建上下文
const AccountListContext = createContext<AccountListContextType | null>(null)

// 上下文提供者Props类型
interface Props {
  children: React.ReactNode
}

// 上下文提供者组件
export default function AccountListProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<AccountListDialogType>(null)
  const [current, setCurrent] = useState<Account | null>(null)

  return (
    <AccountListContext.Provider 
      value={{ 
        open, 
        setOpen, 
        current,
        setCurrent
      }}
    >
      {children}
    </AccountListContext.Provider>
  )
}

// 自定义Hook，用于访问上下文
export const useAccountListContext = () => {
  const accountListContext = useContext(AccountListContext)

  if (!accountListContext) {
    throw new Error('useAccountListContext 必须在 AccountListProvider 内部使用')
  }

  return accountListContext
} 