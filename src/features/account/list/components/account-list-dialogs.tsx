import { AccountListDeleteDialog } from './account-list-delete-dialog'
import { AccountListUpdateGroupDialog } from './account-list-update-group-dialog'
import { AccountListImportDialog } from './account-list-import-dialog'

// 账号列表对话框组件实现
export function AccountListDialogs() {
  return (
    <>
      <AccountListDeleteDialog />
      <AccountListUpdateGroupDialog />
      <AccountListImportDialog />
    </>
  )
} 