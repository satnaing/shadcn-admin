import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import type { Route } from './+types/route'
import { TasksImportDialog } from './components/tasks-import-dialog'

export const formSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please upload a file.' })
    .refine(
      (file) => ['text/csv'].includes(file.type),
      'Please upload csv format.',
    ),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  await sleep(1000)

  // Create a new task
  return redirectWithSuccess('/tasks', {
    message: 'Tasks imported successfully.',
    description: JSON.stringify(submission.value),
  })
}

export default function TaskImport() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <TasksImportDialog
      key="tasks-import"
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
