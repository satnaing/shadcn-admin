import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { data } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import {
  TasksMutateForm,
  updateSchema,
} from '../_shared/components/tasks-mutate-form'
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
  const url = new URL(request.url)
  const submission = parseWithZod(await request.formData(), {
    schema: updateSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // Update the task
  await sleep(1000)
  const taskIndex = tasks.findIndex((t) => t.id === submission.value.id)
  if (taskIndex === -1) {
    throw data(null, { status: 404, statusText: 'Task not found' })
  }
  tasks.splice(taskIndex, 1, submission.value)

  return redirectWithSuccess(`/tasks?${url.searchParams.toString()}`, {
    message: 'Task updated successfully',
    description: `The task ${submission.value.id} has been updated.`,
  })
}

export default function TaskEdit({
  loaderData: { task },
}: Route.ComponentProps) {
  return <TasksMutateForm task={task} />
}
