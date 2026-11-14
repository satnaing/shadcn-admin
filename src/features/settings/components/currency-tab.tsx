import { useState } from 'react'
import { Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Currency } from '../data/settings.type'
import { useCurrencies, useCurrencyMutations } from '../hooks/useCurrencies'
import { CurrencyFormDialog } from './currency-form-dialog'

export default function CurrencyTab() {
  const { t } = useTranslation('settings')
  const { data, isLoading, isError } = useCurrencies()
  const { update, remove } = useCurrencyMutations()
  const [target, setTarget] = useState<Currency | 'new' | null>(null)
  const [toDelete, setToDelete] = useState<Currency | null>(null)
  const currencies = data?.data ?? []

  if (isLoading) return <Skeleton className='h-64 w-full' />
  if (isError) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>{t('common.loadError')}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Button onClick={() => setTarget('new')}>
          <Plus className='size-4' /> {t('currency.add')}
        </Button>
      </div>

      {currencies.length === 0 ? (
        <p className='py-8 text-center text-sm text-muted-foreground'>{t('currency.empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('currency.fields.code')}</TableHead>
              <TableHead>{t('currency.fields.name')}</TableHead>
              <TableHead className='hidden sm:table-cell'>{t('currency.fields.symbol')}</TableHead>
              <TableHead>{t('currency.fields.exchange_rate')}</TableHead>
              <TableHead>{t('currency.fields.is_active')}</TableHead>
              <TableHead className='w-36' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {currencies.map((c) => (
              <TableRow key={c.id}>
                <TableCell className='font-medium'>
                  {c.code}{' '}
                  {c.is_default && (
                    <Badge variant='secondary'>
                      <Star className='size-3' /> {t('currency.default')}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell className='hidden sm:table-cell'>{c.symbol}</TableCell>
                <TableCell>{c.exchange_rate}</TableCell>
                <TableCell>
                  <Switch
                    checked={c.is_active}
                    disabled={c.is_default}
                    aria-label={t('currency.fields.is_active')}
                    onCheckedChange={(is_active) => update.mutate({ id: c.id, values: { is_active } })}
                  />
                </TableCell>
                <TableCell>
                  <div className='flex justify-end gap-1'>
                    {!c.is_default && c.is_active && (
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => update.mutate({ id: c.id, values: { is_default: true } })}
                      >
                        {t('currency.makeDefault')}
                      </Button>
                    )}
                    <Button size='icon' variant='ghost' onClick={() => setTarget(c)} aria-label={t('common.edit')}>
                      <Pencil className='size-4' />
                    </Button>
                    {!c.is_default && (
                      <Button size='icon' variant='ghost' onClick={() => setToDelete(c)} aria-label={t('common.delete')}>
                        <Trash2 className='size-4' />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CurrencyFormDialog target={target} onClose={() => setTarget(null)} />
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t('currency.deleteTitle')}
        desc={t('currency.deleteDesc', { code: toDelete?.code ?? '' })}
        confirmText={t('common.delete')}
        destructive
        isLoading={remove.isPending}
        handleConfirm={() => toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
      />
    </div>
  )
}
