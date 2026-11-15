import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { PrizeFormValues } from '../data/qrcode-event.schema'
import { useQrProducts } from '../hooks/use-qrcode-event'

/** Pick the catalogue products a `product` prize can be paid out with. */
export function QrPrizeProductsField({ form }: { form: UseFormReturn<PrizeFormValues> }) {
  const { t } = useTranslation('qrcode_event')
  const { data } = useQrProducts()

  return (
    <FormField
      control={form.control}
      name='product_ids'
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('prizes.form.products')}</FormLabel>
          <div className='grid max-h-40 gap-2 overflow-y-auto rounded-md border p-3 sm:grid-cols-2'>
            {(data?.data ?? []).map((p) => (
              <label key={p.id} className='flex items-center gap-2 text-sm'>
                <Checkbox
                  checked={field.value.includes(p.id)}
                  onCheckedChange={(on) =>
                    field.onChange(on ? [...field.value, p.id] : field.value.filter((id) => id !== p.id))
                  }
                />
                {p.name}
              </label>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
