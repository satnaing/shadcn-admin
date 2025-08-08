import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from "@conform-to/zod/v4"
import { Form, useActionData, useNavigation } from 'react-router'
import type { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { displayFormSchema, type action } from './route'

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
const defaultValue: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
}

export function DisplayForm() {
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: displayFormSchema }),
  })
  const itemList = fields.items.getFieldList()
  const navigation = useNavigation()

  return (
    <Form method="POST" {...getFormProps(form)} className="space-y-8">
      <div className="space-y-2">
        <div className="mb-4">
          <Label className="text-base">Sidebar</Label>
          <div className="text-muted-foreground text-[0.8rem]">
            Select the items you want to display in the sidebar.
          </div>
        </div>

        {items.map((item) => (
          <div
            className="flex flex-row items-start space-y-0 space-x-3"
            key={item.id}
          >
            <Checkbox
              id={item.id}
              checked={fields.items.value?.includes(item.id)}
              onCheckedChange={(checked) => {
                form.update({
                  name: fields.items.name,
                  value: checked
                    ? [...itemList.map((i) => i.value), item.id]
                    : itemList
                        .map((i) => i.value)
                        .filter((value) => value !== item.id),
                })
              }}
            />
            <Label htmlFor={item.id} className="font-normal">
              {item.label}
            </Label>
          </div>
        ))}
        {itemList.map((item) => (
          <input
            type="hidden"
            name={item.name}
            value={item.value}
            key={item.name}
          />
        ))}
        <div className="text-destructive text-[0.8rem] font-medium empty:hidden">
          {fields.items.errors}
        </div>
      </div>

      <Button type="submit" disabled={navigation.state === 'submitting'}>
        Update display
      </Button>
    </Form>
  )
}
