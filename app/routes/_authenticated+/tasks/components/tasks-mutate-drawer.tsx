import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { HStack } from '~/components/ui/stack'
import type { Task } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  status: z.string().min(1, 'Please select a status.'),
  label: z.string().min(1, 'Please select a label.'),
  priority: z.string().min(1, 'Please choose a priority.'),
})
type TasksForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const [form, fields] = useForm<TasksForm>({
    defaultValue: currentRow ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
    },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
    onSubmit: (event, { submission }) => {
      event.preventDefault()
      if (submission?.status !== 'success') return

      onOpenChange(false)
      form.reset()
      toast('You submitted the following values:', {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(submission.value, null, 2)}
            </code>
          </pre>
        ),
      })
    },
  })

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className="flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...getFormProps(form)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor={fields.title.id}>Title</Label>
            <Input
              {...getInputProps(fields.title, { type: 'text' })}
              key={fields.title.key}
              placeholder="Enter a title"
            />
            <div
              id={fields.title.errorId}
              className="text-[0.8rem] font-medium text-destructive"
            >
              {fields.title.errors}
            </div>
          </div>

          <div>
            <Label htmlFor={fields.status.id}>Status</Label>
            <Select
              key={fields.status.key}
              name={fields.status.name}
              defaultValue={fields.status.initialValue}
              onValueChange={(value) => {
                form.update({
                  name: fields.status.name,
                  value,
                })
              }}
            >
              <SelectTrigger id={fields.status.id}>
                <SelectValue placeholder="Select dropdown" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <div
              id={fields.status.errorId}
              className="text-[0.8rem] font-medium text-destructive"
            >
              {fields.status.errors}
            </div>
          </div>

          <div>
            <Label htmlFor={fields.label.id}>Label</Label>
            <RadioGroup
              key={fields.label.key}
              name={fields.label.name}
              defaultValue={fields.label.initialValue}
              onValueChange={(value) => {
                form.update({
                  name: fields.label.name,
                  value,
                })
              }}
            >
              <HStack>
                <RadioGroupItem id="documentation" value="documentation" />
                <Label htmlFor="documentation">Documentation</Label>
              </HStack>
              <HStack>
                <RadioGroupItem id="feature" value="feature" />
                <Label htmlFor="feature">Feature</Label>
              </HStack>
              <HStack>
                <RadioGroupItem id="bug" value="bug" />
                <Label htmlFor="bug">Bug</Label>
              </HStack>
            </RadioGroup>
            <div
              id={fields.label.errorId}
              className="text-[0.8rem] font-medium text-destructive"
            >
              {fields.label.errors}
            </div>
          </div>

          <div>
            <Label htmlFor={fields.priority.id}>Priority</Label>
            <RadioGroup
              key={fields.priority.key}
              name={fields.priority.name}
              defaultValue={fields.priority.initialValue}
              onValueChange={(value) => {
                form.update({
                  name: fields.priority.name,
                  value,
                })
              }}
            >
              <HStack>
                <RadioGroupItem id="high" value="high" />
                <Label htmlFor="high">High</Label>
              </HStack>
              <HStack>
                <RadioGroupItem id="medium" value="medium" />
                <Label htmlFor="medium">Medium</Label>
              </HStack>
              <HStack>
                <RadioGroupItem id="low" value="low" />
                <Label htmlFor="low">Low</Label>
              </HStack>
            </RadioGroup>
            <div
              id={fields.priority.errorId}
              className="text-[0.8rem] font-medium text-destructive"
            >
              {fields.priority.errors}
            </div>
          </div>
        </Form>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button form={form.id} type="submit">
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
