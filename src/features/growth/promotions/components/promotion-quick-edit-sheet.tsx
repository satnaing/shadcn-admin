import { useEffect } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { type Promotion } from '@/types/growth'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useUploadProductImage } from '@/hooks/queries/use-media'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ImageUpload } from '@/components/ui/image-upload'
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
import { Switch } from '@/components/ui/switch'
import { MultiLangInput } from '@/components/custom/multi-lang-input'
import { MultiLangTextarea } from '@/components/custom/multi-lang-textarea'
import { useUpdatePromotion } from '../hooks/use-update-promotion'

interface PromotionQuickEditSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion: Promotion | null
}

interface QuickEditForm {
  name: Record<string, string>
  description: Record<string, string>
  bannerUrl: Record<string, string>
  isFeatured: boolean
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

  const { mutateAsync: uploadImage } = useUploadProductImage()

  const form = useForm<QuickEditForm>({
    defaultValues: {
      name: { en: '', km: '' },
      description: { en: '', km: '' },
      bannerUrl: {},
      isFeatured: false,
      status: 'ACTIVE',
      startDate: undefined,
      endDate: undefined,
    },
  })

  // Hydrate from the selected promotion
  useEffect(() => {
    if (promotion && open) {
      form.reset({
        name:
          typeof promotion.name === 'string'
            ? { en: promotion.name, km: '' }
            : promotion.name || { en: '', km: '' },
        description:
          typeof promotion.description === 'string'
            ? { en: promotion.description, km: '' }
            : promotion.description || { en: '', km: '' },
        bannerUrl: (promotion.bannerUrl as Record<string, string>) || {},
        isFeatured: promotion.isFeatured ?? false,
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
          name: data.name,
          description: data.description,
          bannerUrl: data.bannerUrl,
          isFeatured: data.isFeatured,
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
      <SheetContent className='flex w-full flex-col overflow-y-auto p-4 sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='truncate'>
            {promotion
              ? typeof promotion.name === 'string'
                ? promotion.name
                : promotion.name?.en
              : 'Edit Promotion'}
          </SheetTitle>
          <SheetDescription>
            Edit promotion details, status, and active date range.
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
                  : `$${Number(promotion.value ?? 0).toFixed(2)}`}{' '}
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
            {/* Content Section */}
            <div className='space-y-4'>
              <span className='text-sm font-medium'>Content</span>

              {/* Multi-lang Name */}
              <FormField
                control={form.control}
                name='name'
                rules={{
                  validate: (val) =>
                    (val?.en && val.en.trim() !== '') ||
                    'English title is required',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiLangInput
                        label='Campaign Name'
                        placeholder='e.g. Summer Sale'
                        value={field.value as Record<string, string>}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Multi-lang Description */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiLangTextarea
                        label='Description'
                        placeholder='Short description shown to customers...'
                        value={field.value as Record<string, string>}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Banner Upload */}
              <FormField
                control={form.control}
                name='bannerUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value?.en || ''}
                        onChange={(url) =>
                          field.onChange({ ...field.value, en: url })
                        }
                        onUpload={async (file) => {
                          const response = await uploadImage(file)
                          if (
                            typeof response === 'object' &&
                            response !== null
                          ) {
                            return response.lg || response.raw || response
                          }
                          return response
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload the promotion banner image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Featured */}
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                    <div className='space-y-0.5'>
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        Show this promotion in featured / highlighted sections.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

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
