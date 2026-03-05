import { useEffect } from 'react'
import { z } from 'zod'
import { type Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Ingredient } from '@/types/inventory'
import { toast } from 'sonner'
import { getTranslation } from '@/utils/i18n'
import {
  useCreateIngredient,
  useUnits,
  useUpdateIngredient,
} from '@/hooks/queries/use-inventory'
import { useZodSchema } from '@/hooks/use-zod-schema'
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { MultiLangInput } from '@/components/custom/multi-lang-input'

interface IngredientSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Ingredient | null
}

const getIngredientSchema = (t: (key: string) => string) =>
  z.object({
    name: z.record(z.string(), z.string()).refine((val) => val.en?.length > 0, {
      message: t('validation.required'),
    }),
    sku: z.string().min(1, { message: t('validation.required') }),
    unitId: z.string().min(1, { message: t('validation.required') }),
    cost: z.coerce.number().min(0),
  })

export function IngredientSheet({
  open,
  onOpenChange,
  initialData,
}: IngredientSheetProps) {
  const formSchema = useZodSchema(getIngredientSchema)
  const createIngredient = useCreateIngredient()
  const updateIngredient = useUpdateIngredient()
  const { data: units } = useUnits()

  type IngredientFormValues = {
    name: Record<string, string>
    sku: string
    unitId: string
    cost: number
  }

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(formSchema) as Resolver<IngredientFormValues>,
    defaultValues: {
      name: { en: '' },
      sku: '',
      unitId: '',
      cost: 0,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || { en: '' },
        sku: initialData.sku,
        unitId: initialData.unitId,
        cost: initialData.cost || 0,
      })
    } else {
      form.reset({
        name: { en: '' },
        sku: '',
        unitId: '',
        cost: 0,
      })
    }
  }, [initialData, form, open])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateIngredient.mutate(
        { id: initialData.id, data: values },
        {
          onSuccess: () => {
            toast.success('Ingredient updated successfully')
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            toast.error('Failed to update ingredient')
            console.error(error)
          },
        }
      )
    } else {
      createIngredient.mutate(values, {
        onSuccess: () => {
          toast.success('Ingredient created successfully')
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          toast.error('Failed to create ingredient')
          console.error(error)
        },
      })
    }
  }

  const isPending = createIngredient.isPending || updateIngredient.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-6 overflow-y-auto p-4'>
        <SheetHeader>
          <SheetTitle>
            {initialData ? 'Edit Ingredient' : 'New Ingredient'}
          </SheetTitle>
          <SheetDescription>
            {initialData
              ? 'Update ingredient details.'
              : 'Add a new ingredient to your inventory.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <MultiLangInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder='e.g. Coffee Beans'
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
                    <Input {...field} placeholder='e.g. ING-001' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-4'>
              <FormField
                control={form.control}
                name='unitId'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select unit' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Array.isArray(units)
                          ? units
                          : (units as any)?.data || []
                        ).map((unit: any) => (
                          <SelectItem
                            key={unit.id}
                            value={unit.id || `unit-${unit.symbol.en}`}
                          >
                            {getTranslation(unit.name)} (
                            {getTranslation(unit.symbol)})
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
                name='cost'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input type='number' step='0.01' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex justify-end pt-4'>
              <Button type='submit' disabled={isPending}>
                {isPending
                  ? 'Saving...'
                  : initialData
                    ? 'Save Changes'
                    : 'Create Ingredient'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
