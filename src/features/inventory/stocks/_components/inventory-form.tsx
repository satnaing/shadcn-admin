import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ShopIngredient } from '@/types/inventory'
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

const formSchema = z.object({
  lowStockThreshold: z.coerce.number().min(0, {
    message: 'Low stock threshold must be a positive number.',
  }),
})

export type InventoryFormValues = z.infer<typeof formSchema>

interface InventoryFormProps {
  onSubmit: (data: InventoryFormValues) => void
  initialData?: ShopIngredient | null
}

export function InventoryForm({ onSubmit, initialData }: InventoryFormProps) {
  const form = useForm<
    z.input<typeof formSchema>,
    unknown,
    InventoryFormValues
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lowStockThreshold: 0,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        lowStockThreshold: initialData.lowStockThreshold,
      })
    } else {
      form.reset({
        lowStockThreshold: 0,
      })
    }
  }, [initialData, form])

  function handleSubmit(data: InventoryFormValues) {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='lowStockThreshold'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Low Stock Threshold</FormLabel>
              <FormControl>
                <Input type='number' {...field} value={field.value as number} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end pt-4'>
          <Button type='submit'>Update Threshold</Button>
        </div>
      </form>
    </Form>
  )
}
