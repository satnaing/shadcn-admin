/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from 'react'
import { type z } from 'zod'
import {
  useForm,
  useFieldArray,
  useWatch,
  type Resolver,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type OptionGroup,
  type OptionChoice,
  type CreateProductRequest,
} from '@/types/api'
import { type Ingredient } from '@/types/inventory'
import _ from 'lodash'
import { ChevronRight, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { calculateRecipeCost, calculateMargin } from '@/utils/cost-engine'
import { formatCurrency } from '@/utils/format'
import {
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useOptionGroups,
} from '@/hooks/queries/use-catalog'
import { useIngredients } from '@/hooks/queries/use-inventory'
import { Badge } from '@/components/ui/badge'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Form,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MultiLangImageUpload } from '@/components/custom/multi-lang-image-upload'
import { MultiLangInput } from '@/components/custom/multi-lang-input'
import { MultiLangTextarea } from '@/components/custom/multi-lang-textarea'
import {
  RecipeRow,
  RecipeUnitSuffix,
  RecipeCostBadge,
} from '../../_components/recipe-row'
import {
  OptionType,
  productSchema,
  ProductStatus,
  InventoryPolicy,
  type Product,
  type Category,
  type ProductOptionChoice,
} from '../../data/schema'

type ProductFormValues = z.infer<typeof productSchema>

function VirtualInheritedRow({
  ingredientId,
  baseQuantity,
  ingredients,
  onOverride,
}: {
  ingredientId: string
  baseQuantity: number
  ingredients?: Ingredient[]
  onOverride: (quantity: number) => void
}) {
  const [val, setVal] = useState(baseQuantity)

  return (
    <div className='flex items-end gap-3 pl-2 opacity-80 transition-opacity hover:opacity-100'>
      <div className='flex min-w-0 flex-1 items-end gap-2'>
        <div className='flex-1 space-y-2'>
          <Select disabled value={ingredientId}>
            <SelectTrigger className='bg-muted/50'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ingredients?.map((ingredient) => (
                <SelectItem key={ingredient.id} value={ingredient.id}>
                  {ingredient.name?.['en'] || ingredient.sku || 'Unknown'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <RecipeCostBadge
          ingredientId={ingredientId}
          quantity={val}
          ingredients={ingredients}
        />
      </div>

      <div className='w-32 shrink-0 space-y-2'>
        <div className='flex items-center gap-1.5'>
          <Input
            type='number'
            value={val}
            onChange={(e) => {
              const n = Number(e.target.value)
              setVal(n)
              onOverride(n)
            }}
            className='w-20 [appearance:textfield] border-dashed text-right [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
          />
          <RecipeUnitSuffix
            ingredientId={ingredientId}
            ingredients={ingredients}
          />
        </div>
      </div>
      <div className='flex h-9 w-9 shrink-0 items-center justify-center' />
    </div>
  )
}

function OptionGroupDetails({ group }: { group: OptionGroup }) {
  if (!group?.choices?.length) {
    return (
      <div className='py-2 text-sm text-muted-foreground'>
        No choices found.
      </div>
    )
  }

  return (
    <div className='grid gap-2 py-2'>
      <div className='mb-1 grid grid-cols-2 text-xs font-medium text-muted-foreground'>
        <span>Choice Name</span>
        <span className='text-right'>Price</span>
      </div>
      {group.choices.map((option: OptionChoice) => (
        <div key={option.id || option.sku} className='grid grid-cols-2 text-sm'>
          <span>{option.name['en'] || 'Untitled'}</span>
          <span className='text-right font-mono'>
            {Number(option.price) > 0
              ? `${formatCurrency(Number(option.price))}`
              : '-'}
          </span>
        </div>
      ))}
    </div>
  )
}

interface ProductSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapProductToForm = (product: any): ProductFormValues => {
  if (!product) {
    return {
      name: { en: '' },
      description: { en: '' },
      sku: '',
      price: {
        name: { en: 'Size' },
        type: OptionType.VARIANT,
        sku: '',
        minSelect: 1,
        maxSelect: 1,
        choices: [
          {
            sku: '',
            name: { en: 'Standard' },
            price: 0,
            recipes: [],
          },
        ],
      },
      priceGroupId: '',
      categoryId: '',
      status: ProductStatus.DRAFT,
      isUnlockable: false,
      inventoryPolicy: InventoryPolicy.NONE,
      imageUrl: {},
      optionGroupIds: [],
      recipes: [],
    }
  }

  const mappedPrice = {
    ...product.price,
    name: product.price?.name || { en: 'Size' },
    choices:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product.price?.choices?.map((choice: any) => ({
        ...choice,
        price: Number(choice.price || 0),
        recipes:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          choice.recipes?.map((r: any) => ({
            ingredientId: r.ingredientId,
            quantity: Number(r.quantity || 0),
            optionId: r.optionId || choice.id || choice.sku,
          })) || [],
      })) || [],
  }

  return {
    ...product,
    name: product.name || { en: '' },
    description: product.description || { en: '' },
    sku: product.sku || '',
    categoryId: product.categoryId || '',
    status: (product.status as ProductStatus) || ProductStatus.DRAFT,
    isUnlockable: product.isUnlockable || false,
    inventoryPolicy: product.inventoryPolicy || InventoryPolicy.NONE,
    imageUrl: product.imageUrl || {},
    price: mappedPrice,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optionGroupIds: product.optionGroups?.map((g: any) => g.id) || [],
    recipes:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product.recipes?.map((r: any) => ({
        ingredientId: r.ingredientId,
        quantity: Number(r.quantity || 0),
        optionId: r.optionId || '',
      })) || [],
  }
}

export function ProductSheet({
  open,
  onOpenChange,
  product,
}: ProductSheetProps) {
  const { data: categories } = useCategories()
  const { data: optionGroups } = useOptionGroups()
  const { data: ingredientsData } = useIngredients({ limit: 1000 })
  const ingredients = useMemo(
    () =>
      (Array.isArray(ingredientsData)
        ? ingredientsData
        : (ingredientsData as any)?.data) || [],
    [ingredientsData]
  )
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()

  const isPending = isCreating || isUpdating

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: mapProductToForm(product),
  })

  useEffect(() => {
    if (open) {
      form.reset(mapProductToForm(product))
    }
  }, [open, product, form])

  const productSku = useWatch({ control: form.control, name: 'sku' })
  useEffect(() => {
    const currentPriceSku = form.getValues('price.sku')
    if (
      productSku &&
      (!currentPriceSku ||
        currentPriceSku === `${productSku}-VAR` ||
        currentPriceSku.endsWith('-VAR'))
    ) {
      form.setValue('price.sku', `${productSku}-VAR`)
    }
  }, [productSku, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'recipes',
  })

  const choicesValue = useWatch({
    control: form.control,
    name: 'price.choices',
  })
  const choices = useMemo(() => choicesValue || [], [choicesValue])

  const recipeItems = useWatch({ control: form.control, name: 'recipes' })
  const priceData = useWatch({ control: form.control, name: 'price' })

  const variantMetrics = useMemo(() => {
    if (!recipeItems) return []

    const baseItems = recipeItems.filter((i) => !i.optionId)
    const ingredientList = Array.isArray(ingredients)
      ? ingredients
      : (ingredients as any)?.data || []

    const baseIngredientsWithCost = baseItems.map((item) => {
      const ingredient = ingredientList.find(
        (i: any) => i.id === item.ingredientId
      )
      return {
        ingredientId: item.ingredientId,
        quantityUsed: Number(item.quantity || 0),
        costPerUnit: ingredient?.cost || 0,
      }
    })

    if (!choices || choices.length <= 1) {
      const cost = calculateRecipeCost(baseIngredientsWithCost)
      const price = Number(priceData?.choices?.[0]?.price) || 0
      const margin = calculateMargin(price, cost)
      return [{ name: 'Base', cost, margin, price, id: 'base' }]
    }

    return choices.map((choice: ProductOptionChoice, index: number) => {
      const choiceId = choice.id || choice.sku || `variant-${index}`
      const price = Number(choice.price) || 0

      const currentIngredients = [...baseIngredientsWithCost]
      const variantItems = recipeItems.filter((i) => i.optionId === choiceId)

      variantItems.forEach((vItem) => {
        const ingredient = ingredientList.find(
          (i: any) => i.id === vItem.ingredientId
        )
        const vItemCost = {
          ingredientId: vItem.ingredientId,
          quantityUsed: Number(vItem.quantity || 0),
          costPerUnit: ingredient?.cost || 0,
        }

        const baseIndex = currentIngredients.findIndex(
          (b) => b.ingredientId === vItem.ingredientId
        )

        if (baseIndex !== -1) {
          currentIngredients[baseIndex] = vItemCost
        } else {
          currentIngredients.push(vItemCost)
        }
      })

      const cost = calculateRecipeCost(currentIngredients)
      const margin = calculateMargin(price, cost)
      return {
        name: choice.name['en'] || `Variant ${index + 1}`,
        cost,
        margin,
        price,
        id: choiceId,
      }
    })
  }, [recipeItems, choices, priceData, ingredients])

  const hasMetrics = variantMetrics.length > 0
  const minCost = hasMetrics
    ? Math.min(...variantMetrics.map((v) => v.cost))
    : 0
  const maxCost = hasMetrics
    ? Math.max(...variantMetrics.map((v) => v.cost))
    : 0
  const minMargin = hasMetrics
    ? Math.min(...variantMetrics.map((v) => v.margin))
    : 0
  const maxMargin = hasMetrics
    ? Math.max(...variantMetrics.map((v) => v.margin))
    : 0

  function onSubmit(data: z.infer<typeof productSchema>) {
    if (product?.id) {
      updateProduct(
        {
          id: product.id,
          data: data as unknown as Partial<CreateProductRequest>,
        },
        {
          onSuccess: () => {
            toast.success('Product updated successfully')
            onOpenChange(false)
            form.reset()
          },
          onError: () => {
            toast.error('Failed to update product')
          },
        }
      )
    } else {
      createProduct(data as unknown as CreateProductRequest, {
        onSuccess: () => {
          toast.success('Product created successfully')
          onOpenChange(false)
          form.reset()
        },
        onError: () => {
          toast.error('Failed to create product')
        },
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-6 overflow-y-auto p-4 sm:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>Create Product</SheetTitle>
          <SheetDescription>
            Add a new product to your menu. Configure pricing, category, and
            modifier options.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <Tabs defaultValue='general' className='w-full'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='general'>General</TabsTrigger>
                <TabsTrigger value='options'>Options</TabsTrigger>
                <TabsTrigger value='recipes'>Recipes</TabsTrigger>
              </TabsList>

              <TabsContent value='general' className='space-y-4 py-4'>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        <MultiLangImageUpload
                          value={field.value || {}}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiLangInput
                          label='Product Name'
                          placeholder='e.g. Latte'
                          value={field.value as Record<string, string>}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='sku'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='SKU'
                          {...field}
                          disabled={!_.isEmpty(product)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormLabel>Pricing Strategy</FormLabel>
                <div className='rounded-lg border p-2'>
                  <FormField
                    control={form.control}
                    name='price.name'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiLangInput
                            label='Label (e.g. Size)'
                            placeholder='Size'
                            value={field.value as Record<string, string>}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='space-y-2'>
                    <div className='mb-2 grid grid-cols-12 gap-2 px-2 pt-2'>
                      <div className='col-span-12 text-sm font-medium md:col-span-5'>
                        Variant Name
                      </div>
                      <div className='col-span-6 text-sm font-medium md:col-span-3'>
                        Price
                      </div>
                      <div className='col-span-5 text-sm font-medium md:col-span-3'>
                        SKU
                      </div>
                      <div className='col-span-1'></div>
                    </div>

                    {choices.map((_, index) => (
                      <div
                        key={index}
                        className='grid grid-cols-12 items-end gap-2 p-2'
                      >
                        <div className='col-span-12 md:col-span-5'>
                          <FormField
                            control={form.control}
                            name={`price.choices.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <MultiLangInput
                                  placeholder='Standard'
                                  value={field.value as Record<string, string>}
                                  onChange={field.onChange}
                                />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='col-span-6 md:col-span-3'>
                          <FormField
                            control={form.control}
                            name={`price.choices.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <Input
                                  type='number'
                                  step='0.01'
                                  {...field}
                                  value={
                                    typeof field.value === 'number'
                                      ? field.value
                                      : 0
                                  }
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='col-span-5 md:col-span-3'>
                          <FormField
                            control={form.control}
                            name={`price.choices.${index}.sku`}
                            render={({ field }) => (
                              <FormItem>
                                <Input {...field} placeholder='SKU' />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='col-span-1 pt-1'>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              const choices =
                                form.getValues('price.choices') || []
                              form.setValue(
                                'price.choices',
                                choices.filter((__, i) => i !== index)
                              )
                            }}
                          >
                            &times;
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type='button'
                      size='sm'
                      variant='outline'
                      className='mt-2 self-end'
                      onClick={() => {
                        const choices = form.getValues('price.choices') || []
                        const parentSku = form.getValues('sku')
                        const newSku = parentSku
                          ? `${parentSku}-${choices.length + 1}`
                          : `VAR-${choices.length + 1}`

                        form.setValue('price.choices', [
                          ...choices,
                          {
                            sku: newSku,
                            name: { en: '' },
                            price: 0,
                            recipes: [],
                          },
                        ])
                      }}
                    >
                      Add Variant
                    </Button>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(Array.isArray(categories)
                              ? categories
                              : (categories as any)?.data || []
                            ).map((category: Category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id || `cat-${category.slug}`}
                              >
                                {category.name['en']}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(ProductStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='inventoryPolicy'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inventory Policy</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select policy' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(InventoryPolicy).map((policy) => (
                              <SelectItem key={policy} value={policy}>
                                {policy}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='isUnlockable'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                      <div className='space-y-0.5'>
                        <FormLabel>Unlockable Product</FormLabel>
                        <p className='text-[0.8rem] text-muted-foreground'>
                          Product requires progression to unlock
                        </p>
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

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiLangTextarea
                          label='Description (Optional)'
                          placeholder='Product description...'
                          value={(field.value || {}) as Record<string, string>}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value='options' className='space-y-4 py-4'>
                <FormField
                  control={form.control}
                  name='optionGroupIds'
                  render={({ field }) => (
                    <FormItem>
                      <div className='grid gap-4'>
                        {(Array.isArray(optionGroups)
                          ? optionGroups
                          : (optionGroups as any)?.data || []
                        ).map((group: OptionGroup) => (
                          <Collapsible key={group.id}>
                            <FormItem className='space-y-0'>
                              <div className='flex cursor-pointer items-start space-x-3 rounded-md border p-3 transition-colors hover:bg-muted/50'>
                                <FormControl
                                  className='mt-1'
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Checkbox
                                    checked={field.value?.includes(group.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            group.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== group.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <div className='flex-1 space-y-2 leading-none'>
                                  <div className='flex items-center'>
                                    <FormLabel className='cursor-pointer text-base font-medium'>
                                      {group.name['en'] || 'Untitled'}
                                    </FormLabel>
                                  </div>
                                  <CollapsibleTrigger asChild>
                                    <Button
                                      variant='ghost'
                                      size='sm'
                                      className='group flex items-center gap-2 p-0 text-sm text-muted-foreground hover:bg-transparent'
                                      type='button'
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ChevronRight className='h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90' />
                                      <span className='sr-only'>
                                        Toggle choices
                                      </span>
                                      <Badge variant='outline'>
                                        {group.type}
                                      </Badge>
                                      <span>
                                        {group._count?.choices || 0} choices
                                      </span>
                                    </Button>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <div
                                      className='mt-2 pl-0'
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <OptionGroupDetails group={group} />
                                    </div>
                                  </CollapsibleContent>
                                </div>
                              </div>
                            </FormItem>
                          </Collapsible>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value='recipes' className='space-y-4 py-4'>
                {!categories || !optionGroups ? (
                  <div className='flex h-60 items-center justify-center'>
                    <BrandLoader />
                  </div>
                ) : (
                  <>
                    <Card>
                      <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>
                          Cost Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <div className='flex items-baseline gap-1'>
                              <span className='text-2xl font-bold'>
                                {minCost === maxCost
                                  ? `$${minCost.toFixed(2)}`
                                  : `$${minCost.toFixed(2)} - $${maxCost.toFixed(2)}`}
                              </span>
                            </div>
                            <p className='text-xs text-muted-foreground'>
                              {minCost === maxCost
                                ? 'Total Ingredient Cost'
                                : 'Ingredient Cost Range'}
                            </p>
                          </div>
                          <div>
                            <div className='flex items-baseline gap-1'>
                              <span
                                className={`text-2xl font-bold ${
                                  minMargin < 60
                                    ? 'text-red-500'
                                    : minMargin > 70
                                      ? 'text-green-500'
                                      : ''
                                }`}
                              >
                                {minMargin === maxMargin
                                  ? `${minMargin}%`
                                  : `${minMargin}% - ${maxMargin}%`}
                              </span>
                            </div>
                            <p className='text-xs text-muted-foreground'>
                              {minMargin === maxMargin
                                ? 'Gross Margin'
                                : 'Margin Range'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className='flex items-center justify-between'>
                      <div className='space-y-1'>
                        <h3 className='text-lg font-medium'>Product Recipe</h3>
                        <p className='text-sm text-muted-foreground'>
                          Define ingredient consumption. Base ingredients are
                          inherited by all variants.
                        </p>
                      </div>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          append({
                            ingredientId: '',
                            quantity: 0,
                            optionId: '',
                          })
                        }
                      >
                        <Plus className='mr-1 h-3 w-3' /> Add Ingredient
                      </Button>
                    </div>

                    <div className='space-y-8'>
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <Badge variant='secondary' className='mb-1'>
                            Base Product
                          </Badge>
                        </div>
                        {fields.filter((f) => !f.optionId).length === 0 && (
                          <p className='pl-2 text-xs text-muted-foreground italic'>
                            No base ingredients.
                          </p>
                        )}
                        {fields.map((field, index) => {
                          if (field.optionId && field.optionId !== '')
                            return null
                          return (
                            <RecipeRow
                              key={field.id}
                              index={index}
                              control={form.control}
                              ingredients={ingredients}
                              onRemove={() => remove(index)}
                            />
                          )
                        })}
                      </div>

                      {choices.length > 1 &&
                        choices.map(
                          (choice: ProductOptionChoice, cIndex: number) => {
                            const choiceId =
                              choice.id || choice.sku || `variant-${cIndex}`
                            const rowsWithLiveValues = fields.map((f, i) => ({
                              ...f,
                              ...recipeItems[i],
                              originalIndex: i,
                            }))
                            const baseRows = rowsWithLiveValues.filter(
                              (f) => !f.optionId
                            )

                            const variantSpecificRows =
                              rowsWithLiveValues.filter(
                                (f) =>
                                  f.optionId === choiceId &&
                                  !baseRows.some(
                                    (b) => b.ingredientId === f.ingredientId
                                  )
                              )

                            return (
                              <div
                                key={choiceId || cIndex}
                                className='space-y-3'
                              >
                                <div className='flex items-center justify-between gap-2 border-t border-dashed pt-4'>
                                  <Badge variant='secondary' className='mb-1'>
                                    {choice.name['en'] ||
                                      `Variant ${cIndex + 1}`}
                                  </Badge>
                                  {(() => {
                                    const metric = variantMetrics.find(
                                      (m) => m.id === choiceId
                                    )
                                    if (!metric) return null
                                    return (
                                      <span className='text-xs text-muted-foreground'>
                                        <span className='font-medium text-foreground'>
                                          ${metric.cost.toFixed(2)}
                                        </span>{' '}
                                        cost •{' '}
                                        <span
                                          className={
                                            metric.margin < 60
                                              ? 'font-medium text-red-500'
                                              : metric.margin > 70
                                                ? 'font-medium text-green-500'
                                                : 'font-medium text-foreground'
                                          }
                                        >
                                          {metric.margin}%
                                        </span>{' '}
                                        margin
                                      </span>
                                    )
                                  })()}
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    className='h-7 px-2 text-xs text-primary'
                                    onClick={() =>
                                      append({
                                        ingredientId: '',
                                        quantity: 0,
                                        optionId: choiceId,
                                      })
                                    }
                                  >
                                    <Plus className='mr-1 h-3 w-3' /> Add
                                    Special Ingredient
                                  </Button>
                                </div>

                                <div className='space-y-3'>
                                  {baseRows.map((baseItem) => {
                                    const overrideIdx = fields.findIndex(
                                      (f) =>
                                        f.optionId === choiceId &&
                                        f.ingredientId === baseItem.ingredientId
                                    )

                                    if (overrideIdx !== -1) {
                                      return (
                                        <RecipeRow
                                          key={`override-${choiceId}-${fields[overrideIdx].ingredientId}-${overrideIdx}`}
                                          index={overrideIdx}
                                          control={form.control}
                                          ingredients={ingredients}
                                          isFixedIngredient={true}
                                          onRemove={() => remove(overrideIdx)}
                                        />
                                      )
                                    }

                                    return (
                                      <VirtualInheritedRow
                                        key={`virtual-${choiceId}-${baseItem.ingredientId}`}
                                        ingredientId={baseItem.ingredientId}
                                        baseQuantity={Number(baseItem.quantity)}
                                        ingredients={ingredients}
                                        onOverride={(newQty: number) =>
                                          append({
                                            ingredientId: baseItem.ingredientId,
                                            quantity: newQty,
                                            optionId: choiceId,
                                          })
                                        }
                                      />
                                    )
                                  })}

                                  {variantSpecificRows.map((vRow) => (
                                    <RecipeRow
                                      key={`special-${choiceId}-${vRow.id}`}
                                      index={vRow.originalIndex}
                                      control={form.control}
                                      ingredients={ingredients}
                                      isFixedIngredient={false}
                                      onRemove={() =>
                                        remove(vRow.originalIndex)
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            )
                          }
                        )}
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>

            <div className='mt-auto flex justify-end pt-4'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
