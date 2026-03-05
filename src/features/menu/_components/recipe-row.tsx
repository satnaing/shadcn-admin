import { type Control, useWatch } from 'react-hook-form'
import { type Ingredient } from '@/types/inventory'
import { getTranslation } from '@/utils/i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
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

export function RecipeUnitSuffix({
  ingredientId,
  ingredients,
}: {
  ingredientId: string
  ingredients?: Ingredient[]
}) {
  const ingredientList = Array.isArray(ingredients)
    ? ingredients
    : (ingredients as any)?.data || []
  const ingredient = ingredientList.find((i: any) => i.id === ingredientId)
  if (!ingredient)
    return <span className='min-w-[24px] text-xs text-muted-foreground'>-</span>

  // Handle both string and object
  const unit = ingredient.unit
  let symbol = '-'

  if (unit && typeof unit === 'object' && 'symbol' in unit) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    symbol = getTranslation((unit as any).symbol)
  }

  return (
    <span className='min-w-[24px] shrink-0 text-xs text-muted-foreground'>
      {symbol}
    </span>
  )
}

export function RecipeCostBadge({
  ingredientId,
  quantity,
  ingredients,
}: {
  ingredientId: string
  quantity: number
  ingredients?: Ingredient[]
}) {
  const ingredientList = Array.isArray(ingredients)
    ? ingredients
    : (ingredients as any)?.data || []
  const ingredient = ingredientList.find((i: any) => i.id === ingredientId)
  const cost = (ingredient?.cost || 0) * (Number(quantity) || 0)

  if (cost <= 0) return null

  return (
    <Badge
      variant='outline'
      className='shrink-0 bg-muted/30 px-1.5 py-0 font-mono text-[10px] whitespace-nowrap'
    >
      ${cost.toFixed(2)}
    </Badge>
  )
}

interface RecipeRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  ingredients?: Ingredient[]
  index?: number // Optional if not part of a field array
  ingredientFieldName?: string
  quantityFieldName?: string
  isFixedIngredient?: boolean
  onRemove?: () => void
  showRemove?: boolean
}

export function RecipeRow({
  control,
  ingredients,
  index,
  ingredientFieldName,
  quantityFieldName,
  isFixedIngredient = false,
  onRemove,
  showRemove = true,
}: RecipeRowProps) {
  // Determine field names based on index or provided names
  const iName =
    ingredientFieldName ||
    (index !== undefined ? `recipes.${index}.ingredientId` : 'ingredientId')
  const qName =
    quantityFieldName ||
    (index !== undefined ? `recipes.${index}.quantity` : 'quantity')

  const ingredientId = useWatch({
    control,
    name: iName,
  })
  const quantity = useWatch({
    control,
    name: qName,
  })

  return (
    <div className='flex items-end gap-3 pl-2'>
      <div className='flex min-w-0 flex-1 items-end gap-2'>
        <FormField
          control={control}
          name={iName}
          render={({ field }) => (
            <FormItem className='flex-1'>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isFixedIngredient}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select ingredient' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(Array.isArray(ingredients)
                    ? ingredients
                    : (ingredients as any)?.data || []
                  ).map((ingredient: any) => (
                    <SelectItem key={ingredient.id} value={ingredient.id}>
                      {ingredient.name?.['en'] || ingredient.sku || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <RecipeCostBadge
          ingredientId={ingredientId}
          quantity={Number(quantity)}
          ingredients={ingredients}
        />
      </div>

      <FormField
        control={control}
        name={qName}
        render={({ field }) => (
          <FormItem className='w-32 shrink-0'>
            <FormControl>
              <div className='flex items-center gap-1.5'>
                <Input
                  type='number'
                  {...field}
                  className='w-20 [appearance:textfield] text-right [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                  value={field.value as number | string}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                <RecipeUnitSuffix
                  ingredientId={ingredientId}
                  ingredients={ingredients}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='flex h-9 w-9 shrink-0 items-center justify-center'>
        {showRemove && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={onRemove}
            disabled={!onRemove}
            className='h-9 w-9 text-muted-foreground hover:text-destructive'
          >
            {onRemove ? <>&times;</> : null}
          </Button>
        )}
      </div>
    </div>
  )
}
