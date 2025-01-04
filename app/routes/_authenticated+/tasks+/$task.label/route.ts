import { parseWithZod } from '@conform-to/zod'
import { setTimeout } from 'node:timers/promises'
import { dataWithError, dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { tasks } from '../_shared/data/tasks'
import type { Route } from './+types/route'

export const action = async ({ request, params }: Route.ActionArgs) => {
  const taskIndex = tasks.findIndex((t) => t.id === params.task)
  if (taskIndex === -1) {
    throw dataWithError(null, { message: 'Task not found' })
  }

  const submission = parseWithZod(await request.formData(), {
    schema: z.object({ label: z.string() }),
  })
  if (submission.status !== 'success') {
    throw dataWithError(submission.error, { message: 'Invalid submission' })
  }

  // update task label
  await setTimeout(1000)
  tasks[taskIndex].label = submission.value.label

  return dataWithSuccess(null, {
    message: 'Task label updated successfully',
    description: `Task ${params.task} label has been updated to ${submission.value.label}`,
  })
}
