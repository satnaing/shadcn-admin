import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { CalendarIcon, Clock, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { type PromotionViewModel } from '../types'

export function StrategySection() {
  const { control, watch } = useFormContext<PromotionViewModel>()

  return (
    <Accordion type='multiple' defaultValue={[]} className='w-full space-y-4'>
      {/* Schedule & Priority */}
      <AccordionItem
        value='schedule'
        className='rounded-lg border bg-card px-4 shadow-sm'
      >
        <AccordionTrigger className='py-4 hover:no-underline'>
          <div className='flex items-center gap-3'>
            <div className='rounded-full bg-blue-50 p-2 text-blue-600'>
              <Clock className='h-4 w-4' />
            </div>
            <div className='text-left'>
              <div className='text-sm font-semibold text-foreground'>
                Schedule & Priority
              </div>
              <div className='text-[10px] font-normal text-muted-foreground'>
                Dates and conflict resolution
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className='space-y-6 pt-2 pb-6'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {/* Start Date */}
            <FormField
              control={control}
              name='startDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='text-xs'>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'h-10 w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date?.toISOString())}
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
              control={control}
              name='endDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='text-xs'>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'h-10 w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => field.onChange(date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Priority Engine */}
          <FormField
            control={control}
            name='priority'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel className='text-xs'>Priority Level</FormLabel>
                  <span className='rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground'>
                    {field.value}
                  </span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={10}
                    defaultValue={[field.value || 0]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                    className='py-2'
                  />
                </FormControl>
                <div className='text-[10px] text-muted-foreground'>
                  Higher priority runs first when overlap occurs.
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Usage Limits */}
      <AccordionItem
        value='limits'
        className='rounded-lg border bg-card px-4 shadow-sm'
      >
        <AccordionTrigger className='py-4 hover:no-underline'>
          <div className='flex items-center gap-3'>
            <div className='rounded-full bg-purple-50 p-2 text-purple-600'>
              <ShieldAlert className='h-4 w-4' />
            </div>
            <div className='text-left'>
              <div className='text-sm font-semibold text-foreground'>
                Usage Limits
              </div>
              <div className='text-[10px] font-normal text-muted-foreground'>
                Cap redemptions per order or account
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className='pt-2 pb-6'>
          <div className='grid grid-cols-1 items-start gap-4 sm:grid-cols-3'>
            <FormField
              control={control}
              name='usageLimitType'
              render={({ field }) => (
                <FormItem className='sm:col-span-2'>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || 'none'}
                  >
                    <FormControl>
                      <SelectTrigger className='h-10'>
                        <SelectValue placeholder='Limit Type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none'>No Limit (Unlimited)</SelectItem>
                      <SelectItem value='ORDER'>Per Order</SelectItem>
                      <SelectItem value='ACCOUNT'>
                        Per Account (Lifetime)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watch('usageLimitType') && watch('usageLimitType') !== 'none' && (
              <FormField
                control={control}
                name='usageLimitValue'
                render={({ field }) => (
                  <FormItem className='animate-in duration-200 zoom-in-95 fade-in'>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Limit'
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                        className='h-10'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className='mt-4 flex flex-col gap-4 border-t pt-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <FormLabel className='text-xs'>Exclude "Dirty" Items</FormLabel>
                <div className='text-[10px] text-muted-foreground'>
                  Skip items that already have a discount.
                </div>
              </div>
              <FormField
                control={control}
                name='excludeDirty'
                render={({ field }) => (
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <FormLabel className='text-xs'>Stackable</FormLabel>
                <div className='text-[10px] text-muted-foreground'>
                  Allow combining with other promotions.
                </div>
              </div>
              <FormField
                control={control}
                name='isStackable'
                render={({ field }) => (
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
