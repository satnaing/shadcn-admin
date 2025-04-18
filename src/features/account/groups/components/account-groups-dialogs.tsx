import { useAccountGroupsContext } from '../context/account-groups-context'
import { AccountGroupsActionDialog } from './account-groups-action-dialog'
import { AccountGroupsDeleteDialog } from './account-groups-delete-dialog'

export function AccountGroupsDialogs() {
  const { open } = useAccountGroupsContext()

  return (
    <>
      {/* 添加/编辑对话框 */}
      {(open === 'add' || open === 'edit') && <AccountGroupsActionDialog />}
      
      {/* 删除对话框 */}
      {open === 'delete' && <AccountGroupsDeleteDialog />}
    </>
  )
} 