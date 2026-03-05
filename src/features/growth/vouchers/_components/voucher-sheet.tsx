import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePromotions } from '@/hooks/queries/use-promotions'
import { useGenerateVouchers } from '@/hooks/queries/use-vouchers'
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
import { UserSelect } from '@/components/custom/user-select'

const formSchema = z.object({
  promotionId: z.string().min(1, 'Promotion is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  userId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VoucherSheet({ open, onOpenChange }: Props) {
  const { data: promotions } = usePromotions()
  const { mutate: generateVouchers, isPending } = useGenerateVouchers()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promotionId: '',
      quantity: 1,
      userId: '',
    },
  })

  const onSubmit = (values: FormValues) => {
    generateVouchers(
      {
        promotionId: values.promotionId,
        quantity: values.quantity,
        userId:
          values.userId === 'none' || !values.userId
            ? undefined
            : values.userId,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='p-4'>
        <SheetHeader>
          <SheetTitle>Generate Vouchers</SheetTitle>
          <SheetDescription>
            Generate a batch of unique voucher codes for a specific promotion.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 pt-4'
          >
            <FormField
              control={form.control}
              name='promotionId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a promotion' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {promotions?.data?.map((promotion) => (
                        <SelectItem key={promotion.id} value={promotion.id}>
                          {typeof promotion.name === 'string'
                            ? promotion.name
                            : promotion.name.en}
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
              name='userId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Assign to User (Optional)</FormLabel>
                  <UserSelect
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Select a user'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 pt-4'>
              <Button
                variant='outline'
                type='button'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
