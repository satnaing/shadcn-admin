import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { MultiLangInput } from '@/components/custom/multi-lang-input'

// Removed broken badge-schema import

interface BadgeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  badge: any | null
  onSave: (badge: any) => void
  isPending?: boolean
}

export function BadgeSheet({
  open,
  onOpenChange,
  badge,
  onSave,
  isPending = false,
}: BadgeSheetProps) {
  const form = useForm<any>({
    defaultValues: {
      label: { en: '', km: '' },
      code: '',
      bgColor: '#3b82f6',
      textColor: '#ffffff',
      isActive: true,
    },
  })

  // Watch values for live preview
  const watchedLabelEn = form.watch('label.en')
  const watchedBgColor = form.watch('bgColor')
  const watchedTextColor = form.watch('textColor')
  const watchedImageUrl = form.watch('imageUrl')

  useEffect(() => {
    if (open) {
      if (badge) {
        form.reset(badge)
      } else {
        form.reset({
          label: { en: '', km: '' },
          code: '',
          bgColor: '#3b82f6',
          textColor: '#ffffff',
          isActive: true,
        })
      }
    }
  }, [open, badge, form])

  function onSubmit(data: any) {
    if (badge?.id) {
      delete data.id // don't push generated id for updates
    }
    onSave(data)
    // Removed synchronous close as it's typically closed via onSuccess now
    // onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex h-full w-full flex-col p-0 sm:max-w-xl'>
        <div className='p-6 pb-2'>
          <SheetHeader>
            <SheetTitle>{badge ? 'Edit Badge' : 'Create Badge'}</SheetTitle>
            <SheetDescription>
              Configure the badge appearance and details.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className='flex-1 overflow-y-auto px-6'>
          <Form {...form}>
            <form
              id='badge-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              {/* Preview Section */}
              <div className='rounded-lg border bg-muted/50 p-4'>
                <FormLabel className='mb-2 block text-xs text-muted-foreground uppercase'>
                  Live Preview
                </FormLabel>
                <div className='flex items-center justify-center p-8 text-center'>
                  <div
                    className='inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium shadow-sm transition-all'
                    style={{
                      backgroundColor: watchedBgColor || '#000000',
                      color: watchedTextColor || '#FFFFFF',
                    }}
                  >
                    {watchedImageUrl && (
                      <img
                        src={watchedImageUrl}
                        alt=''
                        className='h-4 w-4 object-contain'
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    {watchedLabelEn || 'Badge Label'}
                  </div>
                </div>
              </div>

              <div className='grid gap-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='label'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormControl>
                          <MultiLangInput
                            label='Label'
                            value={field.value}
                            onChange={field.onChange}
                            placeholder='e.g. Best Seller'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. BEST_SELLER'
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='bgColor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background</FormLabel>
                        <div className='flex gap-2'>
                          <FormControl>
                            <div className='relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border shadow-sm'>
                              <Input
                                type='color'
                                className='absolute -top-2 -left-2 h-16 w-16 cursor-pointer border-none p-0'
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormControl>
                            <Input
                              placeholder='#000000'
                              className='font-mono uppercase'
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='textColor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Text Color</FormLabel>
                        <div className='flex gap-2'>
                          <FormControl>
                            <div className='relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border shadow-sm'>
                              <Input
                                type='color'
                                className='absolute -top-2 -left-2 h-16 w-16 cursor-pointer border-none p-0'
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormControl>
                            <Input
                              placeholder='#FFFFFF'
                              className='font-mono uppercase'
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://example.com/icon.png'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Paste a URL for the badge icon.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name='isActive'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Active Status
                        </FormLabel>
                        <FormDescription>
                          Badge will be available for products when active.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        <SheetFooter className='p-6 pt-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type='submit' form='badge-form' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
