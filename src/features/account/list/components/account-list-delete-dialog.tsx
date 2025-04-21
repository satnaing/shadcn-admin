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
import { useMutation, useQueryClient } from '@tanstack/react-query'

// 账号列表删除对话框组件实现
export function AccountListDeleteDialog() {
  const { open, setOpen, current } = useAccountListContext()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountService.deleteById(id),
    onSuccess: () => {
      toast.success('账号删除成功', { duration: 2000 })
      queryClient.invalidateQueries({ queryKey: [accountService.path] })
      setOpen(null)
    },
    onError: (error) => {
      console.error('删除账号失败', error)
      toast.error('删除账号时发生错误，请稍后重试')
    },
  })

    // 确认删除
    const onConfirm = async () => {
      if (current) {
        deleteMutation.mutate(current.id)
      }
    }


  return (
    <AlertDialog open={open === 'delete'} onOpenChange={(isOpen) => !isOpen && setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要删除选中的账号吗？此操作不可撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>取消</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={deleteMutation.isPending} 
            className='bg-destructive hover:bg-destructive/90'
          >
            {deleteMutation.isPending ? '删除中...' : '删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 