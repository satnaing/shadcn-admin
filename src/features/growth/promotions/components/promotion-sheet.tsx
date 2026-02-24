import { useEffect, useMemo, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { DiscountType, type Promotion } from '@/types/growth'
import {
  Tag,
  ShoppingCart,
  PackageOpen,
  CheckCircle2,
  Code2,
  Users,
  Globe,
  ListFilter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { MultiLangImageUpload } from '@/components/custom/multi-lang-image-upload'
import { useCreatePromotion } from '../hooks/use-create-promotion'
import { useUpdatePromotion } from '../hooks/use-update-promotion'
import { type PromotionViewModel, type PromotionIntentMode } from '../types'
import { mapFormToDto, mapDtoToForm } from '../utils/promotion-mapper'
import { ActionSection } from './action-section'
import { JsonMirror } from './json-mirror'
import { PromotionSummary } from './promotion-summary'
import { StrategySection } from './strategy-section'
import { UnifiedSearchPicker } from './unified-search-picker'

interface PromotionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Promotion | null
}

const TEMPLATES: {
  mode: PromotionIntentMode
  title: string
  icon: React.ElementType
  desc: string
}[] = [
  {
    mode: 'ITEM_MARKDOWN',
    title: 'Item Markdown',
    icon: Tag,
    desc: 'Simple sale. % or $ off items.',
  },
  {
    mode: 'VOLUME_INCENTIVE',
    title: 'Volume Incentive',
    icon: PackageOpen,
    desc: 'Buy X get Y. Bulk discounts.',
  },
  {
    mode: 'CART_REWARD',
    title: 'Cart Reward',
    icon: ShoppingCart,
    desc: 'Spend $X get $Y off total.',
  },
]

export function PromotionSheet({
  open,
  onOpenChange,
  initialData,
}: PromotionSheetProps) {
  const [devModeOpen, setDevModeOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Default State with Safe Defaults
  const methods = useForm<PromotionViewModel>({
    defaultValues: {
      mode: 'ITEM_MARKDOWN',
      name: '',
      code: '',
      description: '',
      excludeDirty: true,
      targetScope: 'ALL', // Default to all items
      priority: 0,
      isStackable: true, // Default to stackable
      applicationType: 'AUTOMATIC',
      isVoucherRequired: false,
      targets: [],
      discountType: DiscountType.PERCENTAGE,
      discountValue: 0,

      // Mode specifics initialized
      minQuantity: 2,
      minSubtotal: 50,

      // Strategy defaults
      startDate: undefined,
      endDate: undefined,
      usageLimitType: 'none',
      usageLimitValue: undefined,
      tiers: [], // Initialize tiers
    } as unknown as PromotionViewModel,
  })

  // Hydrate form on edit
  useEffect(() => {
    if (initialData && open) {
      const viewModel = mapDtoToForm(initialData)
      methods.reset(viewModel)
    } else if (!initialData && open) {
      methods.reset({
        mode: 'ITEM_MARKDOWN',
        name: '',
        code: '',
        description: '',
        excludeDirty: true,
        targetScope: 'ALL',
        priority: 0,
        isStackable: true,
        applicationType: 'AUTOMATIC',
        isVoucherRequired: false,
        targets: [],
        discountType: DiscountType.PERCENTAGE,
        discountValue: 0,
        minQuantity: 2,
        minSubtotal: 50,
        usageLimitType: 'none',
      } as any)
    }
  }, [initialData, open, methods])

  const { handleSubmit, control, watch, setValue, reset } = methods
  const mode = watch('mode')
  const targetScope = watch('targetScope')

  // Validation Logic
  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const targets = watch('targets')
  const pwpReward = watch('rewardTargets')
  const pwpMode = watch('rewardMode')

  const isValid = useMemo(() => {
    // Date check
    if (startDate && endDate && new Date(startDate) > new Date(endDate))
      return false

    // Trigger check (except for Cart Reward which uses minSubtotal, or ALL scope)
    if (
      mode !== 'CART_REWARD' &&
      targetScope !== 'ALL' &&
      (!targets || targets.length === 0)
    )
      return false

    // PWP Reward Check for VOLUME_INCENTIVE
    if (
      mode === 'VOLUME_INCENTIVE' &&
      pwpMode === 'UNLOCK' &&
      (!pwpReward || pwpReward.length === 0)
    )
      return false

    // PWP Reward Check for ITEM_MARKDOWN
    if (
      mode === 'ITEM_MARKDOWN' &&
      pwpMode === 'UNLOCK' &&
      (!pwpReward || pwpReward.length === 0)
    )
      return false

    return true
  }, [startDate, endDate, targets, pwpReward, pwpMode, mode, targetScope])

  // Hook for mutation
  const { mutate: createMutate, isPending: isCreating } = useCreatePromotion()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdatePromotion()

  const isPending = isCreating || isUpdating

  const onSubmit = (data: PromotionViewModel) => {
    const dto = mapFormToDto(data)

    if (initialData) {
      updateMutate(
        { id: initialData.id, data: dto },
        {
          onSuccess: () => {
            onOpenChange(false)
            reset()
          },
        }
      )
    } else {
      createMutate(dto, {
        onSuccess: () => {
          onOpenChange(false)
          reset()
        },
      })
    }
  }

  const handleTemplateSelect = (newMode: PromotionIntentMode) => {
    setValue('mode', newMode)
    // Reset specific fields if needed
    if (newMode === 'CART_REWARD') {
      setValue('discountType', DiscountType.FIXED)
      setValue('rewardMode', undefined) // Reset reward mode
    } else {
      setValue('discountType', DiscountType.PERCENTAGE)
      setValue('rewardMode', undefined)
    }
  }

  // Progressive Disclosure
  const showRewardSection =
    mode === 'CART_REWARD' ||
    targetScope === 'ALL' ||
    (targets && targets.length > 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-6 overflow-y-auto p-4 sm:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>
            {initialData ? 'Edit Promotion' : 'Promotion Studio'}
          </SheetTitle>
          <SheetDescription>
            Create and manage your marketing campaigns.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-1 flex-col gap-6'
          >
            {/* 1. Intent Selection (Horizontal Scroll) */}
            <div className='space-y-3'>
              <label className='px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
                Goal
              </label>
              <div className='scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0'>
                {TEMPLATES.map((t) => (
                  <div
                    key={t.mode}
                    onClick={() => handleTemplateSelect(t.mode)}
                    className={cn(
                      'relative flex w-[130px] flex-shrink-0 cursor-pointer snap-center flex-col gap-1.5 rounded-xl border p-2.5 transition-all duration-200 sm:w-auto',
                      mode === t.mode
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                        : 'border-muted bg-card hover:bg-muted/30'
                    )}
                  >
                    <div className='flex items-center justify-between'>
                      <div
                        className={cn(
                          'rounded-full p-1',
                          mode === t.mode
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <t.icon className='h-3.5 w-3.5' />
                      </div>
                      {mode === t.mode && (
                        <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                      )}
                    </div>
                    <div>
                      <div className='text-sm leading-tight font-semibold'>
                        {t.title}
                      </div>
                      <div className='mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted-foreground'>
                        {t.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Basic Info */}
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Summer Flash Sale'
                          className='bg-card'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='code'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promotion Code (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. SUMMER2024'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g. 50% off for new customers'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Featured & Banner Section */}
              <div className='space-y-4 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Featured Promotion
                    </FormLabel>
                    <p className='text-sm text-muted-foreground'>
                      Highlight this promotion in the app home screen.
                    </p>
                  </div>
                  <FormField
                    control={control}
                    name='isFeatured'
                    render={({ field }) => (
                      <FormItem>
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

                <FormField
                  control={control}
                  name='bannerUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image (Optional)</FormLabel>
                      <FormControl>
                        <MultiLangImageUpload
                          value={field.value || {}}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 3. Logic Flow */}
            <div className='space-y-4'>
              <label className='px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
                Logic
              </label>

              {/* FLAT STRUCTURE: No dashes, no extra indentation */}
              <div className='space-y-6'>
                {/* Conditions Trigger */}
                <div className='space-y-3'>
                  <label className='text-sm font-medium'>When...</label>
                  {/* Removed nested padding ("p-4") and border for a cleaner look */}
                  <div className='space-y-4'>
                    {mode === 'ITEM_MARKDOWN' && (
                      <div className='flex flex-col gap-4'>
                        {/* Applies-to Toggle */}
                        <FormField
                          control={control}
                          name='targetScope'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs text-muted-foreground'>
                                Applies to
                              </FormLabel>
                              <FormControl>
                                <div className='flex gap-2'>
                                  <button
                                    type='button'
                                    onClick={() => field.onChange('ALL')}
                                    className={cn(
                                      'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                      field.value === 'ALL'
                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                        : 'border-muted bg-card text-muted-foreground hover:bg-muted/30'
                                    )}
                                  >
                                    <Globe className='h-3.5 w-3.5' />
                                    All Items
                                  </button>
                                  <button
                                    type='button'
                                    onClick={() => field.onChange('SPECIFIC')}
                                    className={cn(
                                      'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                      field.value === 'SPECIFIC'
                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                        : 'border-muted bg-card text-muted-foreground hover:bg-muted/30'
                                    )}
                                  >
                                    <ListFilter className='h-3.5 w-3.5' />
                                    Specific Items
                                  </button>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Include Picker: only when SPECIFIC */}
                        {targetScope === 'SPECIFIC' && (
                          <FormField
                            control={control}
                            name='targets'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <UnifiedSearchPicker
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    placeholder='Search items to include (Products, Categories, Collections)...'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Exclusion Section: always visible */}
                        <div className='rounded-lg border border-dashed p-3'>
                          <Label className='mb-2 block text-xs font-semibold text-muted-foreground'>
                            {targetScope === 'ALL'
                              ? 'Except these items (Optional)'
                              : 'Exclude specific items (Optional)'}
                          </Label>
                          <FormField
                            control={control}
                            name='excludedTargets'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <UnifiedSearchPicker
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    placeholder='Search items to exclude...'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {mode === 'VOLUME_INCENTIVE' && (
                      <div className='flex flex-col gap-4'>
                        {/* Applies-to Toggle */}
                        <FormField
                          control={control}
                          name='targetScope'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs text-muted-foreground'>
                                Applies to
                              </FormLabel>
                              <FormControl>
                                <div className='flex gap-2'>
                                  <button
                                    type='button'
                                    onClick={() => field.onChange('ALL')}
                                    className={cn(
                                      'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                      field.value === 'ALL'
                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                        : 'border-muted bg-card text-muted-foreground hover:bg-muted/30'
                                    )}
                                  >
                                    <Globe className='h-3.5 w-3.5' />
                                    All Items
                                  </button>
                                  <button
                                    type='button'
                                    onClick={() => field.onChange('SPECIFIC')}
                                    className={cn(
                                      'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                      field.value === 'SPECIFIC'
                                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                        : 'border-muted bg-card text-muted-foreground hover:bg-muted/30'
                                    )}
                                  >
                                    <ListFilter className='h-3.5 w-3.5' />
                                    Specific Items
                                  </button>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Include Picker: only when SPECIFIC */}
                        {targetScope === 'SPECIFIC' && (
                          <FormField
                            control={control}
                            name='targets'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <UnifiedSearchPicker
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    placeholder='Select items to buy...'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Exclusion Picker */}
                        <div className='rounded-lg border border-dashed p-3'>
                          <Label className='mb-2 block text-xs font-semibold text-muted-foreground'>
                            {targetScope === 'ALL'
                              ? 'Except these items (Optional)'
                              : 'Exclude specific items (Optional)'}
                          </Label>
                          <FormField
                            control={control}
                            name='excludedTargets'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <UnifiedSearchPicker
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    placeholder='Search items to exclude...'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={control}
                          name='minQuantity'
                          render={({ field }) => (
                            <FormItem>
                              <div className='flex items-center gap-3'>
                                <FormLabel className='pt-2 whitespace-nowrap text-muted-foreground'>
                                  Qty Required:
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                    className='w-24'
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Trigger Input */}
                    {mode === 'CART_REWARD' && (
                      <>
                        <div className='flex flex-col gap-4'>
                          {/* Applies-to Toggle */}
                          <FormField
                            control={control}
                            name='targetScope'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-xs text-muted-foreground'>
                                  Applies to
                                </FormLabel>
                                <FormControl>
                                  <div className='flex gap-2'>
                                    <button
                                      type='button'
                                      onClick={() => field.onChange('ALL')}
                                      className={cn(
                                        'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                        field.value === 'ALL'
                                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                          : 'border-muted bg-card text-muted-foreground hover:bg-muted/30'
                                      )}
                                    >
                                      <Globe className='h-3.5 w-3.5' />
                                      All Items
                                    </button>
                                    <button
                                      type='button'
                                      onClick={() => field.onChange('SPECIFIC')}
                                      className={cn(
                                        'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                        field.value === 'SPECIFIC'
                                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                          : 'border-muted bg-card text-muted-foreground hover:bg-muted/30'
                                      )}
                                    >
                                      <ListFilter className='h-3.5 w-3.5' />
                                      Specific Items
                                    </button>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          {/* Include Picker: only when SPECIFIC */}
                          {targetScope === 'SPECIFIC' && (
                            <FormField
                              control={control}
                              name='targets'
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <UnifiedSearchPicker
                                      value={field.value || []}
                                      onChange={field.onChange}
                                      placeholder='Select items to count towards spend...'
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Exclusion Picker */}
                          <div className='rounded-lg border border-dashed p-3'>
                            <Label className='mb-2 block text-xs font-semibold text-muted-foreground'>
                              {targetScope === 'ALL'
                                ? 'Except these items (Optional)'
                                : 'Exclude specific items (Optional)'}
                            </Label>
                            <FormField
                              control={control}
                              name='excludedTargets'
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <UnifiedSearchPicker
                                      value={field.value || []}
                                      onChange={field.onChange}
                                      placeholder='Search items to exclude...'
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Show Tiers ONLY if NOT PWP (Unlock Mode) */}
                        {pwpMode !== 'UNLOCK' ? (
                          <div className='flex flex-col gap-4'>
                            <div className='flex items-center justify-between'>
                              <FormLabel>Reward Tiers</FormLabel>
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                  const currentTiers =
                                    methods.getValues('tiers') || []
                                  methods.setValue('tiers', [
                                    ...currentTiers,
                                    { threshold: 0, value: 0 },
                                  ])
                                }}
                              >
                                + Add Tier
                              </Button>
                            </div>

                            <div className='space-y-3'>
                              {(watch('tiers') || []).map((_, index) => (
                                <div
                                  key={index}
                                  className='flex items-end gap-3 rounded-lg border bg-muted/10 p-3'
                                >
                                  <FormField
                                    control={control}
                                    name={`tiers.${index}.threshold`}
                                    render={({ field }) => (
                                      <FormItem className='flex-1'>
                                        <FormLabel className='text-xs text-muted-foreground'>
                                          Spend ($)
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type='number'
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                parseFloat(e.target.value)
                                              )
                                            }
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <span className='pb-3 text-muted-foreground'>
                                    →
                                  </span>
                                  <FormField
                                    control={control}
                                    name={`tiers.${index}.value`}
                                    render={({ field }) => (
                                      <FormItem className='flex-1'>
                                        <FormLabel className='text-xs text-muted-foreground'>
                                          Get (
                                          {watch('discountType') ===
                                          DiscountType.PERCENTAGE
                                            ? '%'
                                            : '$'}
                                          )
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type='number'
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                parseFloat(e.target.value)
                                              )
                                            }
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 text-muted-foreground hover:text-destructive'
                                    onClick={() => {
                                      const currentTiers =
                                        methods.getValues('tiers') || []
                                      methods.setValue(
                                        'tiers',
                                        currentTiers.filter(
                                          (_, i) => i !== index
                                        )
                                      )
                                    }}
                                  >
                                    <span className='sr-only'>Remove</span>
                                    &times;
                                  </Button>
                                </div>
                              ))}
                              {(!watch('tiers') ||
                                watch('tiers')?.length === 0) && (
                                <div className='rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground'>
                                  No tiers added. Click "+ Add Tier" to start.
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // PWP Mode -> Standard Subtotal Input
                          <FormField
                            control={control}
                            name='minSubtotal'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Cart Subtotal ($)</FormLabel>
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

                        {/* Group Size (MEMBER_COUNT Rule) */}
                        <FormField
                          control={control}
                          name='minMemberCount'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                <div className='flex items-center gap-2'>
                                  <Users className='h-4 w-4' />
                                  Min Group Size{' '}
                                  <span className='font-normal text-muted-foreground'>
                                    (Optional)
                                  </span>
                                </div>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type='number'
                                  placeholder='e.g. 4'
                                  {...field}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    field.onChange(
                                      val ? parseFloat(val) : undefined
                                    )
                                  }}
                                />
                              </FormControl>
                              <p className='text-xs text-muted-foreground'>
                                Require at least this many members in the group
                                cart
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Reward (Progressive Disclosure) */}
                {showRewardSection && (
                  <div className='animate-in duration-300 fade-in slide-in-from-top-2'>
                    <div className='space-y-3'>
                      <label className='text-sm font-medium text-primary'>
                        Then...
                      </label>
                      <ActionSection />
                    </div>
                  </div>
                )}
              </div>

              {/* Activation System */}
              <div className='space-y-4'>
                <Label className='text-sm font-medium'>Activation Type</Label>
                <FormField
                  control={control}
                  name='applicationType'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value || 'AUTOMATIC'}
                          onValueChange={field.onChange}
                          className='flex flex-col gap-3'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='AUTOMATIC' id='auto' />
                            <Label
                              htmlFor='auto'
                              className='cursor-pointer font-normal'
                            >
                              Automatic (No code required)
                            </Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='PUBLIC' id='public' />
                            <Label
                              htmlFor='public'
                              className='cursor-pointer font-normal'
                            >
                              Public Code Required
                            </Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='HIDDEN' id='hidden' />
                            <Label
                              htmlFor='hidden'
                              className='cursor-pointer font-normal'
                            >
                              Hidden (Voucher)
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional: HIDDEN offers voucher option */}
                {watch('applicationType') === 'HIDDEN' && (
                  <FormField
                    control={control}
                    name='isVoucherRequired'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-2 space-y-0'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className='cursor-pointer font-normal'>
                          Require voucher to redeem
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Separator />

            {/* 4. Strategy & Advanced (Accordions) */}
            <StrategySection />

            {/* Footer - Pushed to bottom */}
            <div className='mt-auto flex flex-col gap-4 border-t pt-6'>
              <div className='flex flex-col gap-3'>
                {/* Smart Summary */}
                <div className='relative'>
                  <PromotionSummary />
                </div>

                <div className='flex items-center gap-3'>
                  {/* Dev Mode Trigger (Bottom Left) */}
                  <Sheet
                    open={devModeOpen}
                    onOpenChange={setDevModeOpen}
                    modal={false}
                  >
                    <SheetTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground/30 transition-colors hover:text-muted-foreground'
                      >
                        <Code2 className='h-4 w-4' />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side={isMobile ? 'bottom' : 'right'}
                      className={cn(
                        'flex flex-col p-0',
                        isMobile ? 'h-[85vh] rounded-t-xl' : 'sm:max-w-[500px]'
                      )}
                    >
                      <SheetHeader className='border-b bg-muted/10 px-4 py-3'>
                        <SheetTitle className='text-left text-base'>
                          Dev Mirror
                        </SheetTitle>
                        <SheetDescription className='text-left text-xs'>
                          Live CreatePromotionDto Preview
                        </SheetDescription>
                      </SheetHeader>
                      <div className='flex-1 overflow-auto bg-zinc-950 p-4 font-mono text-xs text-zinc-50'>
                        <JsonMirror />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className='flex-1'></div>

                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => onOpenChange(false)}
                    className='w-24'
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isPending || !isValid}
                    className='min-w-[140px] bg-[#800000] font-medium text-white shadow-lg shadow-red-900/10 hover:bg-[#600000]'
                  >
                    {isPending
                      ? 'Saving...'
                      : initialData
                        ? 'Save Changes'
                        : 'Create Promotion'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
