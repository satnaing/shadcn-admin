import { AccountListDeleteDialog } from './account-list-delete-dialog'
import { AccountListUpdateGroupDialog } from './account-list-update-group-dialog'
import { AccountListImportDialog } from './account-list-import-dialog'
import { useAccountListContext } from '../context/account-list-context'

// 账号列表对话框组件实现
export function AccountListDialogs() {
  const { open } = useAccountListContext()
  return (
    <>
      {open === 'delete' && <AccountListDeleteDialog />}
      {open === 'updateGroup' && <AccountListUpdateGroupDialog />}
      {open === 'import' && <AccountListImportDialog />}
    </>
  )
} 