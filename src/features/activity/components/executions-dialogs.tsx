import { useExecutions } from './executions-provider'
import { ExecutionViewDialog } from './execution-view-dialog'
import { ExecutionCancelDialog } from './execution-cancel-dialog'

export function ExecutionsDialogs() {
  const { open } = useExecutions()

  return (
    <>
      <ExecutionViewDialog open={open === 'view'} />
      <ExecutionCancelDialog open={open === 'cancel'} />
    </>
  )
}
