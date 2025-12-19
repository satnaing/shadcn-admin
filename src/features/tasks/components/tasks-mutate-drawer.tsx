import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { type Task } from '../data/schema'

type TaskMutateDrawerProps = {
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

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm({
    defaultValues: currentRow ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      onOpenChange(false)
      form.reset()
      showSubmittedData(value)
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
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form
          id='tasks-form'
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className='flex-1 space-y-6 overflow-y-auto px-4'
        >
          <form.Field name='title'>
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              >
                <FieldLabel>Title</FieldLabel>
                <Input
                  placeholder='Enter a title'
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name='status'>
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              >
                <FieldLabel>Status</FieldLabel>
                <SelectDropdown
                  defaultValue={field.state.value}
                  onValueChange={field.handleChange}
                  placeholder='Select dropdown'
                  items={[
                    { label: 'In Progress', value: 'in progress' },
                    { label: 'Backlog', value: 'backlog' },
                    { label: 'Todo', value: 'todo' },
                    { label: 'Canceled', value: 'canceled' },
                    { label: 'Done', value: 'done' },
                  ]}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name='label'>
            {(field) => (
              <Field
                className='relative'
                data-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              >
                <FieldLabel>Label</FieldLabel>
                <RadioGroup
                  onValueChange={field.handleChange}
                  defaultValue={field.state.value}
                  className='flex flex-col space-y-1'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='documentation' id='documentation' />
                    <label
                      htmlFor='documentation'
                      className='cursor-pointer font-normal'
                    >
                      Documentation
                    </label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='feature' id='feature' />
                    <label
                      htmlFor='feature'
                      className='cursor-pointer font-normal'
                    >
                      Feature
                    </label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='bug' id='bug' />
                    <label htmlFor='bug' className='cursor-pointer font-normal'>
                      Bug
                    </label>
                  </div>
                </RadioGroup>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name='priority'>
            {(field) => (
              <Field
                className='relative'
                data-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              >
                <FieldLabel>Priority</FieldLabel>
                <RadioGroup
                  onValueChange={field.handleChange}
                  defaultValue={field.state.value}
                  className='flex flex-col space-y-1'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='high' id='high' />
                    <label
                      htmlFor='high'
                      className='cursor-pointer font-normal'
                    >
                      High
                    </label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='medium' id='medium' />
                    <label
                      htmlFor='medium'
                      className='cursor-pointer font-normal'
                    >
                      Medium
                    </label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='low' id='low' />
                    <label htmlFor='low' className='cursor-pointer font-normal'>
                      Low
                    </label>
                  </div>
                </RadioGroup>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                form='tasks-form'
                type='submit'
                disabled={!canSubmit || isSubmitting}
              >
                Save changes
              </Button>
            )}
          </form.Subscribe>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
