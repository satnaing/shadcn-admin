import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { useState } from 'react'
import { data, useNavigate } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import {
  TasksMutateDrawer,
  updateSchema,
} from '../_shared/components/tasks-mutate-drawer'
import { tasks } from '../_shared/data/tasks'
import type { Route } from './+types/route'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const task = tasks.find((t) => t.id === params.task)
  if (!task) {
    throw data(null, { status: 404 })
  }
  return { task }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: updateSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // Update the task
  await sleep(1000)
  const taskIndex = tasks.findIndex((t) => t.id === submission.value.id)
  tasks[taskIndex] = submission.value

  return redirectWithSuccess('/tasks', {
    message: 'Task updated successfully',
    description: JSON.stringify(submission.value),
  })
}

export default function TaskUpdate({
  loaderData: { task },
}: Route.ComponentProps) {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <TasksMutateDrawer
      key="task-update"
      task={task}
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(false)
          // wait for the drawer to close
          setTimeout(() => {
            navigate('/tasks', {
              viewTransition: true,
            })
          }, 300) // the duration of the drawer close animation
        }
      }}
    />
  )
}
