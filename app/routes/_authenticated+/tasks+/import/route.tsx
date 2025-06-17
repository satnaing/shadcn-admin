import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { Form, href, Link } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { HStack } from '~/components/ui/stack'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import type { Route } from './+types/route'

export const formSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please upload a file.' })
    .refine(
      (file) => ['text/csv'].includes(file.type),
      'Please upload csv format.',
    ),
})

export const handle = {
  breadcrumb: () => ({ label: 'Import' }),
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  await sleep(1000)

  // Create a new task
  return redirectWithSuccess('tasks', {
    message: 'Tasks imported successfully.',
    description: JSON.stringify(submission.value),
  })
}

export default function TaskImport() {
  const [form, { file }] = useForm<z.infer<typeof formSchema>>({
    defaultValue: { file: undefined },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })
  const { backUrl } = useSmartNavigation({ baseUrl: href('/tasks') })

  return (
    <div>
      <div className="text-center sm:text-left">
        <h2 className="text-foreground text-lg font-semibold">Import Task</h2>
        <div className="text-muted-foreground text-sm">
          Import tasks quickly from a CSV file.
        </div>
      </div>

      <Separator className="my-4 lg:my-6" />

      <Form {...getFormProps(form)}>
        <div className="mb-2 space-y-1">
          <Label htmlFor={file.id}>File</Label>
          <Input {...getInputProps(file, { type: 'file' })} />
          <div
            id={file.errorId}
            className="text-destructive text-[0.8rem] font-medium empty:hidden"
          >
            {file.errors}
          </div>
        </div>

        <Separator className="my-4 lg:my-6" />

        <HStack className="justify-end">
          <Button variant="link" asChild>
            <Link to={backUrl}>Cancel</Link>
          </Button>
          <Button type="submit">Import</Button>
        </HStack>
      </Form>
    </div>
  )
}
