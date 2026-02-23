import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SurchargeType,
  type SurchargeConfig,
  type CreateSurchargeDto,
} from '@/types/api'
import {
  useCreateSurcharge,
  useUpdateSurcharge,
} from '@/hooks/queries/use-surcharges'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const surchargeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(SurchargeType),
  value: z.number().min(0, 'Value must be positive'),
  isTax: z.boolean(),
  isActive: z.boolean(),
})

type SurchargeFormValues = z.infer<typeof surchargeSchema>

interface SurchargeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: SurchargeConfig | null
}

export function SurchargeSheet({
  open,
  onOpenChange,
  initialData,
}: SurchargeSheetProps) {
  const { mutate: createSurcharge, isPending: isCreating } =
    useCreateSurcharge()
  const { mutate: updateSurcharge, isPending: isUpdating } =
    useUpdateSurcharge()

  const form = useForm<SurchargeFormValues>({
    resolver: zodResolver(surchargeSchema),
    defaultValues: {
      name: initialData?.name.en || '',
      type: initialData?.type || SurchargeType.PERCENTAGE,
      value: initialData?.value || 0,
      isTax: initialData?.isTax || false,
      isActive: initialData?.isActive || true,
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name.en,
          type: initialData.type,
          value: initialData.value,
          isTax: initialData.isTax,
          isActive: initialData.isActive,
        })
      } else {
        form.reset({
          name: '',
          type: SurchargeType.PERCENTAGE,
          value: 0,
          isTax: false,
          isActive: true,
        })
      }
    }
  }, [open, initialData, form])

  function onSubmit(data: SurchargeFormValues) {
    const payload: CreateSurchargeDto = {
      name: { en: data.name },
      value: data.value,
      type: data.type,
      isTax: data.isTax,
      isActive: data.isActive,
    }

    if (initialData) {
      updateSurcharge(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createSurcharge(payload, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const isPending = isCreating || isUpdating

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-6 overflow-y-auto p-4 sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>
            {initialData ? 'Edit Surcharge' : 'Add Surcharge'}
          </SheetTitle>
          <SheetDescription>
            Configure taxes, service charges, and other fees.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. VAT' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SurchargeType.PERCENTAGE}>
                          Percentage
                        </SelectItem>
                        <SelectItem value={SurchargeType.FIXED_AMOUNT}>
                          Fixed Amount
                        </SelectItem>
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
                    <FormLabel>Value</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name='isTax'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Is this a Tax?</FormLabel>
                    <FormDescription>
                      Mark this if it is a government tax (e.g. VAT).
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this surcharge.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className='mt-auto flex justify-end pt-4'>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
