import { Copy, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { type CouponItem } from '../data/promotions.type'

interface CouponsTableProps {
  coupons: CouponItem[]
  isLoading?: boolean
  onToggleStatus: (id: number, current: boolean) => void
  onDelete: (id: number) => void
}

export function CouponsTable({
  coupons,
  isLoading,
  onToggleStatus,
  onDelete,
}: CouponsTableProps) {
  const { t } = useTranslation('promotions')
  const items = Array.isArray(coupons) ? coupons : []

  const handleCopyCode = (code: string) => {
    void navigator.clipboard.writeText(code)
    toast.success(`${code} kodu kopyalandı!`)
  }

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
        {t('coupons.empty', 'Heç bir kupon tapılmadı')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>#</TableHead>
            <TableHead>{t('coupons.code', 'Kupon Kodu')}</TableHead>
            <TableHead>{t('coupons.type', 'Kupon Növü')}</TableHead>
            <TableHead>{t('coupons.discount', 'Endirim')}</TableHead>
            <TableHead>{t('coupons.validity', 'Etibarlılıq')}</TableHead>
            <TableHead>{t('coupons.usage', 'İstifadə Sayı')}</TableHead>
            <TableHead>{t('coupons.status', 'Status')}</TableHead>
            <TableHead className='text-right'>{t('table.actions', 'Əməliyyatlar')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((c, index) => (
            <TableRow key={c.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <span className='font-mono font-bold tracking-wider'>{c.code}</span>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-6 text-muted-foreground hover:text-foreground'
                    onClick={() => handleCopyCode(c.code)}
                  >
                    <Copy className='size-3.5' />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant='outline' className='capitalize text-xs'>
                  {c.type === 'product_base'
                    ? 'Məhsul üzrə'
                    : c.type === 'cart_base'
                      ? 'Səbət üzrə'
                      : 'Xoşgəldin'}
                </Badge>
              </TableCell>
              <TableCell className='font-bold text-emerald-600 dark:text-emerald-400'>
                {c.discount_type === 'percent' ? `${c.discount}%` : `${c.discount.toFixed(2)} ₼`}
              </TableCell>
              <TableCell className='text-xs'>
                <div>{c.start_date}</div>
                <div className='text-muted-foreground'>{c.end_date}</div>
              </TableCell>
              <TableCell className='text-xs'>
                <span className='font-semibold'>{c.used_count}</span>
                {c.usage_limit ? ` / ${c.usage_limit}` : ' (limitsiz)'}
              </TableCell>
              <TableCell>
                <Switch
                  checked={c.status}
                  onCheckedChange={(checked) => onToggleStatus(c.id, checked)}
                />
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:bg-destructive/10'
                  onClick={() => onDelete(c.id)}
                >
                  <Trash2 className='size-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
