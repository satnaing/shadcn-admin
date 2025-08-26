import { ExecutionCancelDialog } from './execution-cancel-dialog'
import { ExecutionViewDialog } from './execution-view-dialog'
import { useExecutions } from './executions-provider'

export function ExecutionsDialogs() {
  const { open } = useExecutions()

  return (
    <>
      <ExecutionViewDialog open={open === 'view'} />
      <ExecutionCancelDialog open={open === 'cancel'} />
    </>
  )
}
