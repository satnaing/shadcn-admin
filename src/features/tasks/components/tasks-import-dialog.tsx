import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Please upload a file',
    })
    .refine(
      (files) => ['text/csv'].includes(files?.[0]?.type),
      'Please upload csv format.'
    ),
})

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog({ open, onOpenChange }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  })

  const fileRef = form.register('file')

  const onSubmit = () => {
    const file = form.getValues('file')

    if (file && file[0]) {
      const fileDetails = {
        name: file[0].name,
        size: file[0].size,
        type: file[0].type,
      }
      toast({
        title: 'You have imported the following file:',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>
              {JSON.stringify(fileDetails, null, 2)}
            </code>
          </pre>
        ),
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='sm:max-w-sm gap-2'>
        <DialogHeader className='text-left'>
          <DialogTitle>Import Tasks</DialogTitle>
          <DialogDescription>
            Import tasks quickly from a CSV file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='task-import-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem className='space-y-1 mb-2'>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type='file' {...fileRef} className='h-8' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2 sm:gap-0'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button type='submit' form='task-import-form'>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
