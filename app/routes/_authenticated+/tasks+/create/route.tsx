import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { redirectWithSuccess } from 'remix-toast'
import {
  TasksMutateForm,
  createSchema,
} from '../_shared/components/tasks-mutate-form'
import { tasks } from '../_shared/data/tasks'
import type { Route } from './+types/route'

export const action = async ({ request }: Route.ActionArgs) => {
  const url = new URL(request.url)
  const submission = parseWithZod(await request.formData(), {
    schema: createSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // Create a new task
  await sleep(1000)
  const { intent, ...task } = submission.value
  const maxIdNumber = tasks.reduce((max, t) => {
    const idNumber = Number.parseInt(t.id.split('-')[1])
    return idNumber > max ? idNumber : max
  }, 0)
  const id = `TASK-${String(maxIdNumber + 1).padStart(4, '0')}`
  tasks.unshift({ id, ...task })

  return redirectWithSuccess(`/tasks?${url.searchParams.toString()}`, {
    message: 'Task created successfully',
    description: JSON.stringify(submission.value),
  })
}

export default function TaskCreate() {
  return <TasksMutateForm />
}
