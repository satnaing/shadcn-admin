import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProducts, useCategories } from '@/hooks/queries/use-catalog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  type LoyaltySettings,
  loyaltySettingsSchema,
} from '../../data/loyalty-schema'
import { UnifiedSearchPicker } from '../../promotions/components/unified-search-picker'

interface LoyaltySettingsFormProps {
  initialData: LoyaltySettings
  onSave: (data: LoyaltySettings) => void
}

export function LoyaltySettingsForm({
  initialData,
  onSave,
}: LoyaltySettingsFormProps) {
  const { data: productsData } = useProducts()
  const { data: categoriesData } = useCategories()

  const productList = Array.isArray(productsData)
    ? productsData
    : productsData?.data || []

  const categoryList = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.data || []

  const form = useForm({
    resolver: zodResolver(loyaltySettingsSchema),
    defaultValues: initialData,
  })

  const watchProducts = form.watch('includeProducts') || []
  const watchCategories = form.watch('includeCategories') || []

  // Wrap productList and categoryList in useMemo to prevent stale UI warnings
  const memoizedProductList = useMemo(() => productList, [productList])
  const memoizedCategoryList = useMemo(() => categoryList, [categoryList])

  const searchPickerValue = useMemo(() => {
    return [
      ...(watchProducts || []).map((id: string) => {
        const product = memoizedProductList.find(
          (p: Record<string, unknown>) => p.id === id
        ) as Record<string, unknown> | undefined
        return {
          id,
          type: 'PRODUCT' as const,
          name: (product?.name as { en: string })?.en || 'Loading...',
        }
      }),
      ...(watchCategories || []).map((id: string) => {
        const cat = memoizedCategoryList.find(
          (c: Record<string, unknown>) => c.id === id
        ) as Record<string, unknown> | undefined
        return {
          id,
          type: 'CATEGORY' as const,
          name: (cat?.name as { en: string })?.en || 'Loading...',
        }
      }),
    ]
  }, [
    watchProducts,
    watchCategories,
    memoizedProductList,
    memoizedCategoryList,
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Rules</CardTitle>
        <CardDescription>
          Configure how customers earn stamps, redeem rewards, and referral
          bonuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id='loyalty-form'
            onSubmit={form.handleSubmit(onSave)}
            className='space-y-6'
          >
            <div className='grid gap-6 sm:grid-cols-2'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='isActive'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Program Status
                        </FormLabel>
                        <FormDescription>
                          Enable or disable the loyalty program entirely.
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

                <h3 className='text-sm font-medium'>Earning & Redemption</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name='minimumSpendPerStamp'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Spend per Stamp</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-muted-foreground'>
                            Spend
                          </span>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className='w-24 text-center'
                          />
                          <span className='text-sm text-muted-foreground'>
                            to get 1 Stamp
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='stampsRequiredForReward'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stamps required for Reward</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-muted-foreground'>
                            Requires
                          </span>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className='w-24 text-center'
                          />
                          <span className='text-sm text-muted-foreground'>
                            Stamps for Reward
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='stampCardDurationDays'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stamp Card Duration (Days)</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            className='w-24 text-center'
                          />
                          <span className='text-sm text-muted-foreground'>
                            Days until stamps expire
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h3 className='pt-4 text-sm font-medium'>Free Reward Value</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a discount type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='PERCENTAGE'>Percentage</SelectItem>
                          <SelectItem value='FIXED'>Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='value'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward Value</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <span className='absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'>
                            {form.watch('type') === 'PERCENTAGE' ? '%' : '$'}
                          </span>
                          <Input
                            type='number'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            className='pl-8'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-col space-y-2 pt-4'>
                  <FormLabel>Eligible Items for Free Reward</FormLabel>
                  {/* We map the string arrays to SearchResultItem objects for the picker */}
                  <UnifiedSearchPicker
                    value={searchPickerValue}
                    onChange={(items) => {
                      const includeProducts = items
                        .filter((i) => i.type === 'PRODUCT')
                        .map((i) => i.id)
                      const includeCategories = items
                        .filter((i) => i.type === 'CATEGORY')
                        .map((i) => i.id)

                      form.setValue('includeProducts', includeProducts, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                      form.setValue('includeCategories', includeCategories, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }}
                    placeholder='Search for products or categories...'
                    mode='ALL'
                  />
                  <FormDescription>
                    These items can be redeemed for free when a stamp card is
                    completed.
                  </FormDescription>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-end border-t px-6 py-4'>
        <Button
          type='submit'
          form='loyalty-form'
          onClick={(_e) => {
            // No custom logic needed for basic stamp card save
          }}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}
