import { useEffect } from 'react'
import { useFieldArray, type Control } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { useIngredients } from '@/hooks/queries/use-inventory'
import { useGetOptionRecipes } from '@/hooks/queries/use-recipes'
import { Button } from '@/components/ui/button'
import { RecipeRow } from '../../_components/recipe-row'

// Local type for display mixing both

interface RecipeInlineProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  choiceId?: string | null
}

export function RecipeInline({ control, name, choiceId }: RecipeInlineProps) {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name,
  })

  // Fetch existing recipes if choiceId is present and field array is empty (initial load)
  const { data: serverRecipes } = useGetOptionRecipes(choiceId || null)
  const { data: ingredients } = useIngredients()

  // Populate form with server recipes on load if empty
  // Use a ref to prevent infinite loops or overwrites if needed, or just check length
  useEffect(() => {
    if (serverRecipes && serverRecipes.length > 0 && fields.length === 0) {
      // Map server recipes to form shape
      const formRecipes = serverRecipes.map((r) => ({
        ingredientId: r.ingredientId,
        quantity: r.quantity,
        optionId: r.optionId,
        id: r.id, // Keep ID for updates?
      }))
      replace(formRecipes)
    }
  }, [serverRecipes, replace, fields.length])

  // Removed local form and mutations

  // Removed conditional return to allow editing even if not saved (Draft Mode)

  return (
    <div className='rounded-md bg-muted/40 p-4'>
      <div className='space-y-3'>
        <h4 className='text-sm font-medium'>Ingredients</h4>

        {/* List of Recipes (Editable) */}
        <div className='space-y-2'>
          {fields.map((field, index) => (
            <RecipeRow
              key={field.id}
              control={control}
              index={index}
              ingredients={
                (Array.isArray(ingredients)
                  ? ingredients
                  : (ingredients as any)?.data) || []
              }
              ingredientFieldName={`${name}.${index}.ingredientId`}
              quantityFieldName={`${name}.${index}.quantity`}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        <div className='flex items-center pt-2'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-8 text-xs text-muted-foreground hover:text-foreground'
            onClick={() => append({ ingredientId: '', quantity: 0 })}
          >
            <Plus className='mr-2 h-3 w-3' /> Add Ingredient
          </Button>
        </div>
      </div>
    </div>
  )
}
