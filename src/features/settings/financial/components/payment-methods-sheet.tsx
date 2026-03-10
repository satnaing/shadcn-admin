import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PaymentCategory,
  type PaymentMethod,
  type CreatePaymentMethodDto,
} from '@/types/api'
import { toast } from 'sonner'
import { useUploadProductImage } from '@/hooks/queries/use-media'
import {
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
} from '@/hooks/queries/use-payment-methods'
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
import { ImageUpload } from '@/components/ui/image-upload'
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

const paymentMethodSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameKm: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionKm: z.string().optional(),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  category: z.nativeEnum(PaymentCategory),
  isDigital: z.boolean(),
  isActive: z.boolean(),
})

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>

interface PaymentMethodSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: PaymentMethod | null
}

export function PaymentMethodSheet({
  open,
  onOpenChange,
  initialData,
}: PaymentMethodSheetProps) {
  const { mutate: createPaymentMethod, isPending: isCreating } =
    useCreatePaymentMethod()
  const { mutate: updatePaymentMethod, isPending: isUpdating } =
    useUpdatePaymentMethod()
  const { mutateAsync: uploadImage } = useUploadProductImage()

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      slug: '',
      nameEn: '',
      nameKm: '',
      descriptionEn: '',
      descriptionKm: '',
      logoUrl: '',
      category: PaymentCategory.CASH,
      isDigital: false,
      isActive: true,
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          slug: initialData.slug,
          nameEn: initialData.name.en,
          nameKm: initialData.name.km || '',
          descriptionEn: initialData.description?.en || '',
          descriptionKm: initialData.description?.km || '',
          logoUrl: initialData.logoUrl || '',
          category: initialData.category,
          isDigital: initialData.isDigital,
          isActive: initialData.isActive,
        })
      } else {
        form.reset({
          slug: '',
          nameEn: '',
          nameKm: '',
          descriptionEn: '',
          descriptionKm: '',
          logoUrl: '',
          category: PaymentCategory.CASH,
          isDigital: false,
          isActive: true,
        })
      }
    }
  }, [open, initialData, form])

  function onSubmit(data: PaymentMethodFormValues) {
    const payload: CreatePaymentMethodDto = {
      slug: data.slug,
      name: { en: data.nameEn, km: data.nameKm || data.nameEn },
      description: {
        en: data.descriptionEn || '',
        km: data.descriptionKm || data.descriptionEn || '',
      },
      logoUrl: data.logoUrl || undefined,
      category: data.category,
      isDigital: data.isDigital,
      isActive: data.isActive,
    }

    if (initialData) {
      updatePaymentMethod(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createPaymentMethod(payload, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const isPending = isCreating || isUpdating

  const handleUpload = async (file: File) => {
    try {
      const response = await uploadImage(file)
      // Response can be a string or an object with variant URLs
      if (typeof response === 'object' && response !== null) {
        return response.lg || response.raw || response.url || ''
      }
      return response
    } catch (error) {
      toast.error('Failed to upload logo')
      throw error
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-6 overflow-y-auto p-4 sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>
            {initialData ? 'Edit Payment Method' : 'Add Payment Method'}
          </SheetTitle>
          <SheetDescription>
            Configure global payment methods for the organization.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. aba-payway' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='nameEn'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (EN)</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. ABA PayWay' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nameKm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (KM)</FormLabel>
                    <FormControl>
                      <Input placeholder='អេប៊ីអេ ផេវេ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='logoUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onUpload={handleUpload}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PaymentCategory).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
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
              name='isDigital'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Is Digital?</FormLabel>
                    <FormDescription>
                      Check if this is a digital payment method (e.g. QR, Card).
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
                      Enable or disable this payment method globally.
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
