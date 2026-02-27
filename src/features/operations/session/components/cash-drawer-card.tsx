import { z } from 'zod'
import { format } from 'date-fns'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentDrawerSession, openDrawer } from '@/services/ops'
import { Lock, Unlock } from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/hooks/use-app-store'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { CloseDrawerDialog } from './close-drawer-dialog'

const openDrawerSchema = z.object({
  openingBalance: z.coerce
    .number()
    .min(0, 'Opening balance cannot be negative'),
  note: z.string().optional(),
})

type OpenDrawerFormValues = z.infer<typeof openDrawerSchema>

export function CashDrawerCard() {
  const { activeShopId } = useAppStore()
  const queryClient = useQueryClient()

  // Fetch current session
  const { data: currentSession, isLoading } = useQuery({
    queryKey: ['cash-drawer', activeShopId],
    queryFn: () => getCurrentDrawerSession(activeShopId!),
    enabled: !!activeShopId,
  })

  const form = useForm<OpenDrawerFormValues>({
    // @ts-expect-error - Known type mismatch between zodResolver and react-hook-form
    resolver: zodResolver(openDrawerSchema),
    defaultValues: {
      openingBalance: 0,
      note: '',
    },
  })

  const openMutation = useMutation({
    mutationFn: openDrawer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-drawer'] })
      toast.success('Cash drawer opened successfully')
    },
    onError: () => toast.error('Failed to open drawer'),
  })

  const onSubmit: SubmitHandler<OpenDrawerFormValues> = (values) => {
    if (!activeShopId) return
    openMutation.mutate({
      shopId: activeShopId,
      openingBalance: values.openingBalance,
      note: values.note,
    })
  }

  if (isLoading) return <BrandLoader />

  if (currentSession) {
    // DRAWER OPEN STATE
    return (
      <Card className='border-l-4 border-l-blue-500'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Unlock className='h-5 w-5 text-blue-500' />
              Cash Drawer Open
            </CardTitle>
            <div className='text-sm font-medium text-emerald-600'>Active</div>
          </div>
          <CardDescription>Current session details</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='rounded-md bg-muted p-3'>
              <div className='text-xs text-muted-foreground'>Opened By</div>
              <div className='font-medium'>
                {currentSession.openedBy || 'Unknown'}
              </div>
            </div>
            <div className='rounded-md bg-muted p-3'>
              <div className='text-xs text-muted-foreground'>Opened At</div>
              <div className='font-medium'>
                {format(new Date(currentSession.startedAt), 'HH:mm')}
              </div>
            </div>
            <div className='rounded-md bg-muted p-3'>
              <div className='text-xs text-muted-foreground'>Starting Cash</div>
              <div className='font-medium'>
                ${currentSession.openingBalance.toFixed(2)}
              </div>
            </div>
            <div className='rounded-md bg-muted p-3'>
              <div className='text-xs text-muted-foreground'>Current Est.</div>
              <div className='font-medium'>
                {/* Placeholder for real-time calculation if available, else just say 'Tracking...' */}
                Tracking...
              </div>
            </div>
          </div>

          <CloseDrawerDialog session={currentSession} />
        </CardContent>
      </Card>
    )
  }

  // DRAWER CLOSED STATE
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Lock className='h-5 w-5' />
          Cash Drawer Closed
        </CardTitle>
        <CardDescription>
          Open the drawer to start accepting cash payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='w-full'>Open Drawer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Open Cash Drawer</DialogTitle>
              <DialogDescription>
                Enter the amount of cash currently in the drawer.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit as SubmitHandler<any>)}
                className='space-y-4'
              >
                <FormField
                  name='openingBalance'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Balance</FormLabel>
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
                      <FormLabel>Note (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Any initial notes...'
                          className='resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end pt-4'>
                  <Button type='submit' disabled={openMutation.isPending}>
                    {openMutation.isPending ? 'Opening...' : 'Confirm Open'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
