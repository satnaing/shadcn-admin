import { Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type PayoutRequestItem } from '../data/sellers.type'

interface PayoutRequestsTableProps {
  requests: PayoutRequestItem[]
  isLoading?: boolean
  onUpdateStatus: (id: number, status: 'paid' | 'rejected') => void
}

export function PayoutRequestsTable({
  requests,
  isLoading,
  onUpdateStatus,
}: PayoutRequestsTableProps) {
  const { t } = useTranslation('sellers')
  const items = Array.isArray(requests) ? requests : []

  if (isLoading) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('table.loading', 'Yüklənir...')}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('payout.empty', 'Heç bir çıxarış sorğusu tapılmadı')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>#</TableHead>
            <TableHead>{t('table.shop', 'Mağaza')}</TableHead>
            <TableHead>{t('payout.amount', 'Məbləğ')}</TableHead>
            <TableHead>{t('payout.method', 'Ödəniş Metodu')}</TableHead>
            <TableHead>{t('payout.date', 'Tarix')}</TableHead>
            <TableHead>{t('payout.status', 'Status')}</TableHead>
            <TableHead className='text-right'>{t('table.actions', 'Əməliyyat')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((r, index) => (
            <TableRow key={r.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell className='font-semibold'>{r.shop_name}</TableCell>
              <TableCell className='font-bold text-emerald-600 dark:text-emerald-400'>
                {r.amount.toFixed(2)} ₼
              </TableCell>
              <TableCell className='text-sm capitalize'>{r.payment_method}</TableCell>
              <TableCell className='text-xs text-muted-foreground'>{r.date}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    r.status === 'paid'
                      ? 'success'
                      : r.status === 'rejected'
                        ? 'destructive'
                        : 'outline'
                  }
                >
                  {r.status === 'paid'
                    ? t('payout.paid', 'Ödənilib')
                    : r.status === 'rejected'
                      ? t('payout.rejected', 'İmtina edilib')
                      : t('payout.pending', 'Gözləyir')}
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                {r.status === 'pending' ? (
                  <div className='flex items-center justify-end gap-1'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='text-emerald-600 hover:bg-emerald-50'
                      onClick={() => onUpdateStatus(r.id, 'paid')}
                      title={t('payout.approve', 'Təsdiqlə və Ödə')}
                    >
                      <Check className='size-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:bg-destructive/10'
                      onClick={() => onUpdateStatus(r.id, 'rejected')}
                      title={t('payout.reject', 'İmtina et')}
                    >
                      <X className='size-4' />
                    </Button>
                  </div>
                ) : (
                  <span className='text-xs text-muted-foreground'>—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
