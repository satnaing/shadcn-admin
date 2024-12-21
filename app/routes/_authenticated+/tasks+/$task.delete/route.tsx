import { setTimeout as sleep } from 'node:timers/promises'
import { useState } from 'react'
import { data, useNavigate } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { ConfirmDialog } from '~/components/confirm-dialog'
import { tasks } from '../_shared/data/tasks'
import type { Route } from './+types/route'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const task = tasks.find((t) => t.id === params.task)
  if (!task) {
    throw data(null, { status: 404 })
  }
  return { task }
}

export const action = async ({ params }: Route.ActionArgs) => {
  const taskIndex = tasks.findIndex((t) => t.id === params.task)
  if (taskIndex === -1) {
    throw data(null, { status: 404, statusText: 'Task not found' })
  }

  // Delete the task
  await sleep(1000)
  tasks.splice(taskIndex, 1)

  return redirectWithSuccess('/tasks', {
    message: 'Task deleted successfully',
    description: `Task with ID ${params.task} has been deleted.`,
  })
}

export default function TaskDelete({
  loaderData: { task },
}: Route.ComponentProps) {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <ConfirmDialog
      key="task-delete"
      destructive
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(false)
          // wait for the modal to close
          setTimeout(() => {
            navigate('/tasks', {
              viewTransition: true,
            })
          }, 300) // the duration of the modal close animation
        }
      }}
      className="max-w-md"
      title={`Delete this task: ${task.id} ?`}
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
