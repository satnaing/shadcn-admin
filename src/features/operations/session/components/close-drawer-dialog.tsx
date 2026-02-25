import { useState } from 'react'
import { z } from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { closeDrawer } from '@/services/ops'
import { type CashDrawerSession } from '@/types/ops'
import { toast } from 'sonner'
import { useAppStore } from '@/hooks/use-app-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from '@/components/ui/textarea'

interface CloseDrawerDialogProps {
  session: CashDrawerSession
}

const closeDrawerSchema = z.object({
  closingBalance: z.coerce
    .number()
    .min(0, 'Closing balance cannot be negative'),
  note: z.string().optional(),
})

type CloseDrawerFormValues = z.infer<typeof closeDrawerSchema>

export function CloseDrawerDialog({ session }: CloseDrawerDialogProps) {
  const { activeShopId } = useAppStore()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm<CloseDrawerFormValues>({
    // @ts-expect-error - Known type mismatch between zodResolver and react-hook-form
    resolver: zodResolver(closeDrawerSchema),
    defaultValues: {
      closingBalance: 0,
      note: '',
    },
  })

  const closeMutation = useMutation({
    mutationFn: closeDrawer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-drawer'] })
      toast.success('Drawer closed successfully')
      setOpen(false)
    },
    onError: () => toast.error('Failed to close drawer'),
  })

  const onSubmit: SubmitHandler<CloseDrawerFormValues> = (values) => {
    if (!activeShopId) return
    closeMutation.mutate({
      shopId: activeShopId,
      closingBalance: values.closingBalance,
      note: values.note,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          Close Drawer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Cash Drawer</DialogTitle>
          <DialogDescription>
            Count the physical cash in the drawer to close the session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as SubmitHandler<any>)}
            className='space-y-4'
          >
            <div className='rounded-md bg-muted p-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Opening Balance:</span>
                <span className='font-medium'>
                  ${session.openingBalance.toFixed(2)}
                </span>
              </div>
              {/* Future: Add expected cash from sales here */}
            </div>

            <FormField
              name='closingBalance'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Balance (Counted Cash)</FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Discrepancies/Comments)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Explain any discrepancies...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end pt-4'>
              <Button
                type='submit'
                variant='destructive'
                disabled={closeMutation.isPending}
              >
                {closeMutation.isPending ? 'Closing...' : 'Close Session'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
