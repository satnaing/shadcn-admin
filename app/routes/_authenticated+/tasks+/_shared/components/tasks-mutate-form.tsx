import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { Form, href, Link, useNavigation } from 'react-router'
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
import { Separator } from '~/components/ui/separator'
import { HStack } from '~/components/ui/stack'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import type { Task } from '../data/schema'

export const createSchema = z.object({
  intent: z.literal('create'),
  title: z
    .string({
      error: 'Title is required.',
    })
    .trim()
    .min(1, 'Title is required.'),
  status: z.string({ error: 'Please select a status.' }),
  label: z.string({ error: 'Please select a label.' }),
  priority: z.string({ error: 'Please choose a priority.' }),
})

export const updateSchema = z.object({
  intent: z.literal('update'),
  id: z.string(),
  title: z
    .string({ error: 'Title is required.' })
    .trim()
    .min(1, 'Title is required.'),
  status: z.string({ error: 'Please select a status.' }),
  label: z.string({ error: 'Please select a label.' }),
  priority: z.string({ error: 'Please choose a priority.' }),
})

const formSchema = z.discriminatedUnion('intent', [createSchema, updateSchema])

export function TasksMutateForm({ task }: { task?: Task }) {
  const isUpdate = !!task
  const [form, fields] = useForm({
    defaultValue: task ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
    },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
    shouldRevalidate: 'onBlur',
  })
  const navigation = useNavigation()
  const { backUrl } = useSmartNavigation({ baseUrl: href('/tasks') })

  return (
    <Form method="POST" {...getFormProps(form)} className="space-y-5">
      <input {...getInputProps(fields.id, { type: 'hidden' })} />
      <div className="space-y-1">
        <Label htmlFor={fields.title.id}>Title</Label>
        <Input
          {...getInputProps(fields.title, { type: 'text' })}
          placeholder="Enter a title"
        />
        <div
          id={fields.title.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.title.errors}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={fields.status.id}>Status</Label>
        <Select
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
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.status.errors}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor={fields.label.id}>Label</Label>
        <RadioGroup
          name={fields.label.name}
          defaultValue={fields.label.initialValue}
          onValueChange={(value) => {
            form.update({
              name: fields.label.name,
              value,
            })
          }}
          className="gap-3"
        >
          <HStack className="gap-3">
            <RadioGroupItem id="documentation" value="documentation" />
            <Label htmlFor="documentation" className="font-normal">
              Documentation
            </Label>
          </HStack>
          <HStack className="gap-3">
            <RadioGroupItem id="feature" value="feature" />
            <Label htmlFor="feature" className="font-normal">
              Feature
            </Label>
          </HStack>
          <HStack className="gap-3">
            <RadioGroupItem id="bug" value="bug" />
            <Label htmlFor="bug" className="font-normal">
              Bug
            </Label>
          </HStack>
        </RadioGroup>
        <div
          id={fields.label.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.label.errors}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor={fields.priority.id}>Priority</Label>
        <RadioGroup
          name={fields.priority.name}
          defaultValue={fields.priority.initialValue}
          onValueChange={(value) => {
            form.update({
              name: fields.priority.name,
              value,
            })
          }}
          className="gap-3"
        >
          <HStack className="gap-3">
            <RadioGroupItem id="high" value="high" />
            <Label htmlFor="high" className="font-normal">
              High
            </Label>
          </HStack>
          <HStack className="gap-3">
            <RadioGroupItem id="medium" value="medium" />
            <Label htmlFor="medium" className="font-normal">
              Medium
            </Label>
          </HStack>
          <HStack className="gap-3">
            <RadioGroupItem id="low" value="low" />
            <Label htmlFor="low" className="font-normal">
              Low
            </Label>
          </HStack>
        </RadioGroup>
        <div
          id={fields.priority.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.priority.errors}
        </div>
      </div>

      <Separator className="my-4 lg:my-6" />

      <HStack className="justify-end gap-2">
        <Button variant="link" asChild>
          <Link to={backUrl}>Cancel</Link>
        </Button>
        <Button
          form={form.id}
          type="submit"
          name="intent"
          value={isUpdate ? 'update' : 'create'}
          disabled={navigation.state === 'submitting'}
        >
          Save changes
        </Button>
      </HStack>
    </Form>
  )
}
