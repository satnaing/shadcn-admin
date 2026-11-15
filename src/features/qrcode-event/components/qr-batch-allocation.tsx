import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { BatchFormValues } from '../data/qrcode-event.schema'
import { useQrPrizes } from '../hooks/use-qrcode-event'

/** How many of the new codes win each prize of the chosen campaign (rest are non-winning). */
export function QrBatchAllocation({ form, campaignId }: { form: UseFormReturn<BatchFormValues>; campaignId: number }) {
  const { t } = useTranslation('qrcode_event')
  const { data } = useQrPrizes(campaignId || undefined)
  const prizes = data?.data ?? []
  if (!campaignId) return null

  return (
    <FormField
      control={form.control}
      name='prize_allocation'
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('batches.form.allocation')}</FormLabel>
          {prizes.length === 0 && <p className='text-sm text-muted-foreground'>{t('batches.form.noPrizes')}</p>}
          <div className='grid gap-3 sm:grid-cols-2'>
            {prizes.map((p) => (
              <label key={p.id} className='flex items-center justify-between gap-3 rounded-md border p-2 text-sm'>
                <span className='truncate'>
                  {p.title} <span className='text-muted-foreground'>({p.quantity - p.allocated_count})</span>
                </span>
                <Input
                  type='number'
                  min={0}
                  className='w-24'
                  value={field.value[String(p.id)] ?? 0}
                  onChange={(e) => field.onChange({ ...field.value, [String(p.id)]: Number(e.target.value) })}
                />
              </label>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
