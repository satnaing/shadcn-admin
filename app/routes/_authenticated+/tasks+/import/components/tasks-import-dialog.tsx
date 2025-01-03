import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form } from 'react-router'
import type { z } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { formSchema } from '../route'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog({ open, onOpenChange }: Props) {
  const [form, { file }] = useForm<z.infer<typeof formSchema>>({
    defaultValue: { file: undefined },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className="gap-2 sm:max-w-sm">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle>Import Tasks</DialogTitle>
          <DialogDescription>
            Import tasks quickly from a CSV file.
          </DialogDescription>
        </DialogHeader>
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
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit" form={form.id}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
