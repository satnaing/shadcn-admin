import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { Form, Link } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { HStack } from '~/components/ui/stack'
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
  const url = new URL(request.url)
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  await sleep(1000)

  // Create a new task
  return redirectWithSuccess(`/tasks?${url.search.toString()}`, {
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

  return (
    <div>
      <div className="text-center sm:text-left">
        <h2 className="text-lg font-semibold text-foreground">Create Task</h2>
        <div className="text-sm text-muted-foreground">
          Add a new task by providing necessary info. Click save when
          you&apos;re done.
        </div>
      </div>

      <Separator className="my-4 lg:my-6" />

      <Form {...getFormProps(form)}>
        <div className="mb-2 space-y-1">
          <Label htmlFor={file.id}>File</Label>
          <Input {...getInputProps(file, { type: 'file' })} key={file.key} />
          <div
            id={file.errorId}
            className="text-[0.8rem] font-medium text-destructive empty:hidden"
          >
            {file.errors}
          </div>
        </div>

        <HStack>
          <Button variant="link" asChild>
            <Link to="/tasks">Cancel</Link>
          </Button>
          <Button type="submit">Import</Button>
        </HStack>
      </Form>
    </div>
  )
}
