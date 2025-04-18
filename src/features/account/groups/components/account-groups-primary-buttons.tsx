import { Button } from '@/components/ui/button'
import { useAccountGroupsContext } from '../context/account-groups-context'
import { IconUsersPlus } from '@tabler/icons-react'

export function AccountGroupsPrimaryButtons() {
  const { setOpen } = useAccountGroupsContext()

  // 打开添加账号组对话框
  const onAdd = () => {
    setOpen('add')
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={onAdd}>
      <IconUsersPlus size={18} />
        添加账号组
      </Button>
    </div>
  )
} 