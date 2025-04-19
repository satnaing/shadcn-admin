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
import { useAccountGroupsContext } from '../context/account-groups-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GROUP_URL, deleteAccountGroup } from '@/services/account-groups'
import { toast } from 'sonner'

export function AccountGroupsDeleteDialog() {
  const { open, setOpen, currentGroup } = useAccountGroupsContext()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAccountGroup(id),
    onSuccess: () => {
      toast.success('账号组删除成功')
      queryClient.invalidateQueries({ queryKey: [GROUP_URL] })
    },
    onError: (error) => {
      console.error('删除账号组失败:', error)
      toast.error('删除账号组失败')
    },
  })

  // 确认删除
  const onConfirm = async () => {
    if (currentGroup) {
      deleteMutation.mutate(currentGroup.id, {
        onSuccess: () => {
          setOpen(null)
        }
      })
    }
  }

  // 取消删除
  const onCancel = () => {
    setOpen(null)
  }

  // 如果没有选中的账号组，则不显示对话框
  if (!currentGroup) return null

  return (
    <AlertDialog open={open === 'delete'} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要删除账号组 <span className="font-bold">{currentGroup.name}</span> 吗？
            <br />
            此操作不可逆，该组的所有账户将失去其关联。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={deleteMutation.isPending}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? '删除中...' : '删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 