import { useFormContext } from 'react-hook-form'
import { DiscountType } from '@/types/growth'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type PromotionViewModel } from '../types'
import { UnifiedSearchPicker } from './unified-search-picker'

export function ActionSection() {
  const { control, watch, setValue } = useFormContext<PromotionViewModel>()
  const mode = watch('mode')
  const discountType = watch('discountType')
  const rewardMode = watch('rewardMode')

  // Determine the synthetic value for the Select
  let selectValue = discountType as string
  if (discountType === DiscountType.FIXED_PRICE) {
    selectValue = rewardMode === 'UNLOCK' ? 'UNLOCK_REWARD' : 'BUNDLE_PRICE'
  }

  const handleTypeChange = (val: string) => {
    if (val === 'UNLOCK_REWARD') {
      setValue('discountType', DiscountType.FIXED_PRICE)
      setValue('rewardMode', 'UNLOCK')
      setValue('rewardQuantity', 1) // Default limit
    } else if (val === 'BUNDLE_PRICE') {
      setValue('discountType', DiscountType.FIXED_PRICE)
      setValue('rewardMode', 'BUNDLE')
      setValue('rewardTargets', []) // Clear targets
      setValue('rewardQuantity', undefined)
    } else {
      setValue('discountType', val as DiscountType)
      setValue('rewardMode', undefined)
    }
  }

  const getLabel = () => {
    if (selectValue === 'UNLOCK_REWARD') return 'Offer Price ($)'
    if (selectValue === 'BUNDLE_PRICE') return 'Bundle Price ($)'
    if (discountType === DiscountType.PERCENTAGE) return 'Percentage (%)'
    return 'Discount Amount ($)'
  }

  // ── ITEM_MARKDOWN: Support both simple discounts AND PWP ──
  if (mode === 'ITEM_MARKDOWN') {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <FormItem className={rewardMode === 'UNLOCK' ? 'col-span-2' : ''}>
            <FormLabel>Reward Type</FormLabel>
            <Select value={selectValue} onValueChange={handleTypeChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={DiscountType.PERCENTAGE}>
                  Percentage Off
                </SelectItem>
                <SelectItem value={DiscountType.FIXED}>
                  Fixed Amount Off
                </SelectItem>
                {/* PWP Option for Category-level */}
                <SelectItem value='UNLOCK_REWARD'>
                  Unlock Reward (PWP)
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {/* Value Input: Hide if Unlock Reward (will show below) */}
          {selectValue !== 'UNLOCK_REWARD' && (
            <FormField
              control={control}
              name='discountValue'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getLabel()}</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* PWP / Unlock Reward Picker */}
        {rewardMode === 'UNLOCK' && (
          <div className='space-y-4 rounded-md border bg-muted/20 p-4'>
            <div className='space-y-2'>
              <span className='text-sm font-medium'>Unlock Reward Item</span>
              <p className='text-xs text-muted-foreground'>
                Customer can buy these items for{' '}
                {watch('discountValue')
                  ? `$${watch('discountValue')}`
                  : 'a special price'}{' '}
                after buying from selected category.
              </p>
            </div>

            <div className='flex flex-col gap-4'>
              <FormField
                control={control}
                name='rewardTargets'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reward Items (Product only)</FormLabel>
                    <FormControl>
                      <UnifiedSearchPicker
                        value={field.value || []}
                        onChange={(items) => {
                          field.onChange(items)
                          // Auto-fill price from FIRST item if available and price not set
                          const firstItem = items[0]
                          const currentPrice = watch('discountValue')
                          if (firstItem && firstItem.price && !currentPrice) {
                            setValue('discountValue', firstItem.price)
                          }
                        }}
                        placeholder='Search for reward item...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price Input */}
              {(watch('rewardTargets')?.length || 0) <= 2 && (
                <FormField
                  control={control}
                  name='discountValue'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Offer Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                          placeholder='e.g. 1.00'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Quantity Limit */}
              <FormField
                control={control}
                name='rewardQuantity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Quantity per Order</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        placeholder='e.g. 1'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── CART_REWARD / VOLUME_INCENTIVE: Full reward type selector ──
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <FormItem className={rewardMode === 'UNLOCK' ? 'col-span-2' : ''}>
          <FormLabel>Reward Type</FormLabel>
          <Select value={selectValue} onValueChange={handleTypeChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select type' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={DiscountType.PERCENTAGE}>
                Percentage Off
              </SelectItem>
              <SelectItem value={DiscountType.FIXED}>
                Fixed Amount Off
              </SelectItem>

              {/* PWP Option */}
              <SelectItem value='UNLOCK_REWARD'>Unlock Reward (PWP)</SelectItem>

              {/* Volume Incentive Specific */}
              {mode === 'VOLUME_INCENTIVE' && (
                <SelectItem value='BUNDLE_PRICE'>Fixed Price</SelectItem>
              )}
            </SelectContent>
          </Select>
        </FormItem>

        {/* Value Logic: Hide if Tiered Cart Reward OR PWP (will show below) */}
        {selectValue !== 'UNLOCK_REWARD' &&
          !(mode === 'CART_REWARD' && (watch('tiers')?.length || 0) > 0) && (
            <FormField
              control={control}
              name='discountValue'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getLabel()}</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        {/* Max Quantity Cap (Volume Incentive only, non-PWP) */}
        {mode === 'VOLUME_INCENTIVE' && selectValue !== 'UNLOCK_REWARD' && (
          <FormField
            control={control}
            name='rewardQuantity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Quantity Discounted</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Unlimited'
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <p className='text-xs text-muted-foreground'>
                  Limit discount to first X items
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* PWP / Unlock Reward Picker */}
      {rewardMode === 'UNLOCK' && (
        <div className='space-y-4 rounded-md border bg-muted/20 p-4'>
          <div className='space-y-2'>
            <span className='text-sm font-medium'>Unlock Reward Item</span>
            <p className='text-xs text-muted-foreground'>
              Customer can buy these items for{' '}
              {watch('discountValue')
                ? `$${watch('discountValue')}`
                : 'a special price'}{' '}
              after meeting conditions.
            </p>
          </div>

          <div className='flex flex-col gap-4'>
            <FormField
              control={control}
              name='rewardTargets'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Items (Product or Category)</FormLabel>
                  <FormControl>
                    <UnifiedSearchPicker
                      value={field.value || []}
                      onChange={(items) => {
                        field.onChange(items)
                        // Auto-fill price from FIRST item if available and price not set
                        const firstItem = items[0]
                        const currentPrice = watch('discountValue')
                        if (firstItem && firstItem.price && !currentPrice) {
                          setValue('discountValue', firstItem.price)
                        }
                      }}
                      placeholder='Search for reward item...'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Input: Only if <= 2 items selected */}
            {(watch('rewardTargets')?.length || 0) <= 2 && (
              <FormField
                control={control}
                name='discountValue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Offer Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        placeholder='e.g. 5.00'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
