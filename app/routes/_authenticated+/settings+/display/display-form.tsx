import { z } from 'zod'
import { useForm, getFormProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form } from 'react-router'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'

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

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
const defaultValue: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
}

export function DisplayForm() {
  const [form, fields] = useForm({
    defaultValue,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: displayFormSchema }),
    onSubmit: (event, { submission }) => {
      event.preventDefault()
      if (submission?.status !== 'success') return
      toast('You submitted the following values:', {
        description: (
          <pre className='mt-2 w-[320px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify(submission.value, null, 2)}
            </code>
          </pre>
        ),
      })
    },
  })
  const itemList = fields.items.getFieldList()

  return (
    <Form method='POST' {...getFormProps(form)} className='space-y-8'>
      <div className='space-y-2'>
        <div>
          <Label className='text-base'>Sidebar</Label>
          <div className='text-[0.8rem] text-muted-foreground'>
            Select the items you want to display in the sidebar.
          </div>
        </div>

        {items.map((item) => (
          <div
            className='flex flex-row items-start space-x-3 space-y-0'
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
            <Label htmlFor={item.id} className='font-normal'>
              {item.label}
            </Label>
          </div>
        ))}
        {itemList.map((item) => (
          <input
            type='hidden'
            name={item.name}
            value={item.value}
            key={item.name}
          />
        ))}
        <div className='text-sm text-destructive'>{fields.items.errors}</div>
      </div>

      <Button type='submit'>Update display</Button>
      <div>{JSON.stringify(form.allErrors)}</div>
    </Form>
  )
}
