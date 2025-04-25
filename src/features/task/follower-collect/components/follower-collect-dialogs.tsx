import { useDataTableContext } from '@/components/data-table/data-table-context'
import { FollowerCollectTaskCreateDialog } from './follower-collect-task-create-dialog'

// 粉丝采集任务列表对话框组件实现
export function FollowerCollectDialogs() {
  const { open } = useDataTableContext()
  return (
    <>
      {open === 'create' && <FollowerCollectTaskCreateDialog />}
    </>
  )
} 