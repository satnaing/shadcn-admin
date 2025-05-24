import { setTimeout as sleep } from 'node:timers/promises'
import { useEffect } from 'react'
import { data, href, useFetcher } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { ConfirmDialog } from '~/components/confirm-dialog'
import type { Task } from '../_shared/data/schema'
import { tasks } from '../_shared/data/tasks'
import type { Route } from './+types/route'

export const action = async ({ params }: Route.ActionArgs) => {
  const taskIndex = tasks.findIndex((t) => t.id === params.task)
  if (taskIndex === -1) {
    throw data(null, { status: 404, statusText: 'Task not found' })
  }

  // Delete the task
  await sleep(1000)
  tasks.splice(taskIndex, 1)

  return dataWithSuccess(
    {
      done: true,
    },
    {
      message: 'Task deleted successfully',
      description: `Task with ID ${params.task} has been deleted.`,
    },
  )
}

export function TaskDeleteConfirmDialog({
  task,
  open,
  onOpenChange,
}: {
  task: Task
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const fetcher = useFetcher<typeof action>({ key: `task-delete-${task.id}` })

  useEffect(() => {
    if (fetcher.data?.done) onOpenChange(false)
  }, [fetcher.data, onOpenChange])

  return (
    <ConfirmDialog
      key="task-delete"
      destructive
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-md"
      title={`Delete this task: ${task.id} ?`}
      fetcher={fetcher}
      action={href('/tasks/:task/delete', { task: task.id })}
      desc={
        <>
          You are about to delete a task with the ID <strong>{task.id}</strong>.{' '}
          <br />
          This action cannot be undone.
        </>
      }
      confirmText="Delete"
    />
  )
}
