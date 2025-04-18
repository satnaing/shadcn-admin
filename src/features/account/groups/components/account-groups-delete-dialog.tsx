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
import { useDeleteAccountGroup } from '../hooks/use-account-groups'

export function AccountGroupsDeleteDialog() {
  const { open, setOpen, currentGroup } = useAccountGroupsContext()
  const deleteMutation = useDeleteAccountGroup()
  
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
            此操作不可逆，该组的所有用户将失去其关联的权限。
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