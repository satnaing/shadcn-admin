import { useState } from 'react'
import { useAccountListContext } from '../context/account-list-context'
import { accountService } from '@/services/account-services'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

// 账号列表删除对话框组件实现
export function AccountListDeleteDialog() {
  const { open, setOpen, selectedAccounts, refreshData } = useAccountListContext()
  const [isLoading, setIsLoading] = useState(false)

  // 批量删除操作
  const handleDelete = async () => {
    setIsLoading(true)
    try {
      // 获取选中的账号ID列表
      const accountIds = selectedAccounts.map(account => account.id)
      
      // 调用批量删除API
      if (accountIds.length === 1) {
        // 单个删除
        await accountService.deleteAccount(accountIds[0])
      } else {
        // 批量删除
        await accountService.batchDeleteAccounts(accountIds)
      }
      
      // 操作成功提示
      toast.success(`成功删除 ${accountIds.length} 个账号`)
      
      // 刷新数据
      refreshData()
      
      // 关闭对话框
      setOpen(null)
    } catch (error) {
      console.error('删除账号失败', error)
      toast.error('删除账号时发生错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={(isOpen) => !isOpen && setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要删除选中的 {selectedAccounts.length} 个账号吗？此操作不可撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isLoading} 
            className='bg-destructive hover:bg-destructive/90'
          >
            {isLoading ? '删除中...' : '删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 