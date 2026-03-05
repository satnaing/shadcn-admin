import { type z } from 'zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useIngredients } from '@/hooks/queries/use-inventory'
import {
  useGetOptionRecipes,
  useCreateRecipe,
  useDeleteRecipe,
} from '@/hooks/queries/use-recipes'
import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { productRecipeSchema } from '../../data/schema'

// We need a schema for adding a recipe, but without optionId/productId since they are context
const addRecipeSchema = productRecipeSchema.pick({
  ingredientId: true,
  quantity: true,
})

type AddRecipeFormValues = z.infer<typeof addRecipeSchema>

interface RecipeDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  optionId: string | null
  choiceName: string
}

export function RecipeDrawer({
  open,
  onOpenChange,
  optionId,
  choiceName,
}: RecipeDrawerProps) {
  const { data: recipes, isLoading: isLoadingRecipes } =
    useGetOptionRecipes(optionId)
  const { data: ingredientsData, isLoading: isLoadingIngredients } =
    useIngredients()
  const ingredients = Array.isArray(ingredientsData)
    ? ingredientsData
    : (ingredientsData as any)?.data || []

  const { mutate: createRecipe, isPending: isCreating } = useCreateRecipe()
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe()

  const form = useForm<AddRecipeFormValues>({
    // @ts-expect-error - Known type mismatch between zodResolver and react-hook-form
    resolver: zodResolver(addRecipeSchema),
    defaultValues: {
      ingredientId: '',
      quantity: 0,
    } as AddRecipeFormValues,
  })

  const onSubmit: SubmitHandler<AddRecipeFormValues> = (data) => {
    if (!optionId) return

    createRecipe(
      {
        ...data,
        optionId,
      },
      {
        onSuccess: () => {
          toast.success('Ingredient added to recipe')
          form.reset({ ingredientId: '', quantity: 0 })
        },
        onError: () => {
          toast.error('Failed to add ingredient')
        },
      }
    )
  }

  function handleDelete(id: string) {
    deleteRecipe(id, {
      onSuccess: () => toast.success('Ingredient removed'),
      onError: () => toast.error('Failed to remove ingredient'),
    })
  }

  // Initial loading state
  if (!open) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-6 sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>Recipe for {choiceName}</SheetTitle>
          <SheetDescription>
            Manage ingredients required for this specific option choice.
          </SheetDescription>
        </SheetHeader>

        {/* Existing Recipes List */}
        <div className='flex-1 overflow-y-auto'>
          <h3 className='mb-3 text-sm font-medium'>Ingredients</h3>
          {isLoadingRecipes ? (
            <div className='flex items-center justify-center py-4'>
              <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
            </div>
          ) : recipes?.length === 0 ? (
            <div className='flex h-20 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground'>
              No ingredients linked yet.
            </div>
          ) : (
            <div className='space-y-3'>
              {recipes?.map((recipe) => (
                <div
                  key={recipe.id}
                  className='flex items-center justify-between rounded-md border p-3'
                >
                  <div className='space-y-1'>
                    <div className='font-medium'>
                      {recipe.ingredient?.name?.['en'] || 'Unknown Ingredient'}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {recipe.quantity} {/* @ts-ignore */}
                      {typeof recipe.ingredient?.unit?.symbol === 'object'
                        ? (recipe.ingredient?.unit?.symbol as any)['en']
                        : recipe.ingredient?.unit?.symbol || ''}
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDelete(recipe.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className='h-4 w-4 text-destructive' />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Add New Recipe Form */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium'>Add Ingredient</h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as SubmitHandler<any>)}
              className='space-y-4'
            >
              <FormField
                name='ingredientId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredient</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingIngredients}
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
                        ).map((ing: any) => (
                          <SelectItem key={ing.id} value={ing.id}>
                            {ing.name?.['en'] || ing.sku}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-end gap-3'>
                <FormField
                  name='quantity'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.0001'
                          placeholder='0.00'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isCreating || !optionId}>
                  {isCreating ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Plus className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
