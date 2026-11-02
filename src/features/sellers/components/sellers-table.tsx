import { Eye, HandCoins } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type SellerItem } from '../data/sellers.type'

interface SellersTableProps {
  sellers: SellerItem[]
  isLoading?: boolean
  onView: (seller: SellerItem) => void
  onPay: (seller: SellerItem) => void
  onToggleApproval?: (id: number, current: boolean) => void
  onToggleBan: (id: number, current: boolean) => void
}

export function SellersTable({
  sellers,
  isLoading,
  onView,
  onPay,
  onToggleApproval,
  onToggleBan,
}: SellersTableProps) {
  const { t } = useTranslation('sellers')
  const items = Array.isArray(sellers) ? sellers : []

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
        {t('table.empty', 'Heç bir satıcı tapılmadı')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>#</TableHead>
            <TableHead>{t('table.shop', 'Mağaza / Satıcı')}</TableHead>
            <TableHead>{t('table.metrics', 'Məhsul / Sifariş')}</TableHead>
            <TableHead>{t('table.balance', 'Balans')}</TableHead>
            <TableHead>{t('table.approval', 'Təsdiq')}</TableHead>
            <TableHead>{t('table.ban', 'Qadağa (Ban)')}</TableHead>
            <TableHead className='text-right'>{t('table.actions', 'Əməliyyatlar')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((s, index) => (
            <TableRow key={s.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {s.logo ? (
                    <img src={s.logo} alt={s.name} className='size-10 rounded-full object-cover' />
                  ) : (
                    <div className='size-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary'>
                      {s.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className='font-semibold flex items-center gap-1.5'>
                      {s.name}
                      {s.is_verified && (
                        <Badge variant='success' className='text-[10px] px-1 py-0'>
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className='text-xs text-muted-foreground'>{s.seller_name} • {s.seller_phone}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className='text-xs font-medium'>{s.products_count} məhsul</div>
                <div className='text-xs text-muted-foreground'>{s.orders_count} sifariş</div>
              </TableCell>
              <TableCell className='font-bold text-emerald-600 dark:text-emerald-400'>
                {s.balance.toFixed(2)} ₼
              </TableCell>
              <TableCell>
                {onToggleApproval ? (
                  <Switch
                    checked={s.is_approved}
                    onCheckedChange={(checked) => onToggleApproval(s.id, checked)}
                  />
                ) : (
                  <Badge variant={s.is_approved ? 'success' : 'outline'}>
                    {s.is_approved ? t('status.approved', 'Təsdiqlənib') : t('status.pending', 'Gözləyir')}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Switch
                  checked={s.is_banned}
                  onCheckedChange={(checked) => onToggleBan(s.id, checked)}
                />
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-1'>
                  <Button variant='ghost' size='icon' onClick={() => onView(s)}>
                    <Eye className='size-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='gap-1 text-xs'
                    onClick={() => onPay(s)}
                  >
                    <HandCoins className='size-3.5' />
                    {t('actions.pay', 'Ödə')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
