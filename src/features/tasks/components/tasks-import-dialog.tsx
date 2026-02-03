// Remove unused adapter import
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'File is required')
    .refine(
      (files) =>
        files?.[0]?.type === 'text/csv' ||
        files?.[0]?.type === 'application/json',
      'File must be a CSV or JSON file'
    ),
})

type TasksImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog({
  open,
  onOpenChange,
}: TasksImportDialogProps) {
  const form = useForm({
    defaultValues: {
      file: undefined as unknown as FileList,
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      // In a real app, you would parse the file here or send it to server
      const file = value.file[0]
      if (file) {
        const fileDetails = {
          name: file.name,
          size: file.size,
          type: file.type,
        }
        showSubmittedData(fileDetails, 'You have imported the following file:')
      }
      onOpenChange(false)
      form.reset()
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>Import Tasks</DialogTitle>
          <DialogDescription>
            Import tasks from a JSON or CSV file.
          </DialogDescription>
        </DialogHeader>
        <form
          id='task-import-form'
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className='space-y-4'
        >
          <form.Field name='file'>
            {(field) => (
              <Field
                data-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              >
                <FieldLabel>File</FieldLabel>
                <Input
                  type='file'
                  accept='.csv, .json'
                  className='h-8 py-0'
                  name={field.name}
                  onChange={(e) => {
                    const files = e.target.files
                    if (files) field.handleChange(files)
                  }}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </form>
        <DialogFooter className='gap-2 sm:gap-0'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                form='task-import-form'
                type='submit'
                disabled={!canSubmit || isSubmitting}
              >
                Import
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
