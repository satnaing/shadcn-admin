import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { type CurrencyFormValues, currencySchema } from '../data/settings.schema'
import type { Currency } from '../data/settings.type'
import { useCurrencyMutations } from '../hooks/useCurrencies'

interface CurrencyFormDialogProps {
  /** `null` = closed, `'new'` = create, a currency = edit */
  target: Currency | 'new' | null
  onClose: () => void
}

const EMPTY: CurrencyFormValues = {
  code: '',
  name: '',
  symbol: '',
  exchange_rate: 1,
  decimal_places: 2,
  position: 'after',
  is_active: true,
}

export function CurrencyFormDialog({ target, onClose }: CurrencyFormDialogProps) {
  const { t } = useTranslation('settings')
  const { create, update } = useCurrencyMutations()
  const currency = target && target !== 'new' ? target : null
  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
    defaultValues: EMPTY,
  })
  const { errors } = form.formState

  useEffect(() => {
    if (target) form.reset(currency ? { ...currency } : EMPTY)
  }, [target, currency, form])

  const submit = form.handleSubmit((values) =>
    currency
      ? update.mutate({ id: currency.id, values }, { onSuccess: onClose })
      : create.mutate(values, { onSuccess: onClose })
  )

  const text = (name: 'code' | 'name' | 'symbol') => (
    <div className='space-y-2'>
      <Label htmlFor={`cur-${name}`}>{t(`currency.fields.${name}`)}</Label>
      <Input id={`cur-${name}`} aria-invalid={Boolean(errors[name])} {...form.register(name)} />
    </div>
  )

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currency ? t('currency.editTitle') : t('currency.createTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className='space-y-4' noValidate>
          <div className='grid gap-4 sm:grid-cols-3'>
            {text('code')}
            {text('name')}
            {text('symbol')}
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='cur-rate'>{t('currency.fields.exchange_rate')}</Label>
              <Input
                id='cur-rate'
                type='number'
                step='any'
                aria-invalid={Boolean(errors.exchange_rate)}
                {...form.register('exchange_rate', { valueAsNumber: true })}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='cur-decimals'>{t('currency.fields.decimal_places')}</Label>
              <Input
                id='cur-decimals'
                type='number'
                aria-invalid={Boolean(errors.decimal_places)}
                {...form.register('decimal_places', { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className='flex items-center justify-between rounded-md border p-3'>
            <Label htmlFor='cur-active'>{t('currency.fields.is_active')}</Label>
            <Controller
              control={form.control}
              name='is_active'
              render={({ field }) => (
                <Switch id='cur-active' checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          {Object.keys(errors).length > 0 && (
            <p className='text-sm text-destructive'>{t('common.invalid')}</p>
          )}
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type='submit' disabled={create.isPending || update.isPending}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
