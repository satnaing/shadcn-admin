import { useEffect } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { type Promotion } from '@/types/growth'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useUpdatePromotion } from '../hooks/use-update-promotion'

interface PromotionQuickEditSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion: Promotion | null
}

interface QuickEditForm {
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  startDate: Date | undefined
  endDate: Date | undefined
}

export function PromotionQuickEditSheet({
  open,
  onOpenChange,
  promotion,
}: PromotionQuickEditSheetProps) {
  const { mutate: updatePromotion, isPending } = useUpdatePromotion()

  const form = useForm<QuickEditForm>({
    defaultValues: {
      status: 'ACTIVE',
      startDate: undefined,
      endDate: undefined,
    },
  })

  // Hydrate from the selected promotion
  useEffect(() => {
    if (promotion && open) {
      form.reset({
        status: (promotion.status as QuickEditForm['status']) ?? 'ACTIVE',
        startDate: promotion.startDate
          ? new Date(promotion.startDate)
          : undefined,
        endDate: promotion.endDate ? new Date(promotion.endDate) : undefined,
      })
    }
  }, [promotion, open, form])

  const onSubmit = (data: QuickEditForm) => {
    if (!promotion) return

    // Validate date range
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      form.setError('endDate', {
        message: 'End date must be after start date',
      })
      return
    }

    updatePromotion(
      {
        id: promotion.id,
        data: {
          status: data.status,
          startDate: data.startDate?.toISOString(),
          endDate: data.endDate?.toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success('Promotion updated')
          onOpenChange(false)
        },
        onError: () => {
          toast.error('Failed to update promotion')
        },
      }
    )
  }

  const handleClearDates = () => {
    form.setValue('startDate', undefined)
    form.setValue('endDate', undefined)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col p-4 sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='truncate'>
            {promotion?.name?.en ?? 'Edit Promotion'}
          </SheetTitle>
          <SheetDescription>
            Quickly update the promotion's status and active date range.
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {/* Promotion summary card */}
        {promotion && (
          <div className='space-y-1 rounded-xl border bg-muted/30 px-4 py-3 text-sm'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Type</span>
              <span className='font-medium capitalize'>
                {promotion.type?.toLowerCase().replace('_', ' ')}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Discount</span>
              <span className='font-mono font-medium'>
                {promotion.type === 'PERCENTAGE'
                  ? `${promotion.value ?? 0}%`
                  : `$${(promotion.value ?? 0).toFixed(2)}`}{' '}
                OFF
              </span>
            </div>
            {promotion.code && (
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Code</span>
                <span className='font-mono font-medium'>{promotion.code}</span>
              </div>
            )}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-1 flex-col gap-6'
          >
            {/* Status */}
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='ACTIVE'>
                          <div className='flex items-center gap-2'>
                            <span className='h-2 w-2 rounded-full bg-green-500' />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value='INACTIVE'>
                          <div className='flex items-center gap-2'>
                            <span className='h-2 w-2 rounded-full bg-gray-400' />
                            Inactive
                          </div>
                        </SelectItem>
                        <SelectItem value='ARCHIVED'>
                          <div className='flex items-center gap-2'>
                            <span className='h-2 w-2 rounded-full bg-orange-400' />
                            Archived
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Range */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Active Date Range</span>
                <button
                  type='button'
                  onClick={handleClearDates}
                  className='text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline'
                >
                  Clear dates (always active)
                </button>
              </div>

              {/* Start Date */}
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Immediate (no start)'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'No end date'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            !!(
                              form.getValues('startDate') &&
                              date < form.getValues('startDate')!
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className='mt-auto pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
