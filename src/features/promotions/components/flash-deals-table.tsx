import { Flame, Trash2 } from 'lucide-react'
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
import { type FlashDealItem } from '../data/promotions.type'

interface FlashDealsTableProps {
  deals: FlashDealItem[]
  isLoading?: boolean
  onToggleStatus: (id: number, current: boolean) => void
  onToggleFeatured: (id: number, current: boolean) => void
  onDelete: (id: number) => void
}

export function FlashDealsTable({
  deals,
  isLoading,
  onToggleStatus,
  onToggleFeatured,
  onDelete,
}: FlashDealsTableProps) {
  const { t } = useTranslation('promotions')
  const items = Array.isArray(deals) ? deals : []

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
        {t('deals.empty', 'Heç bir flash satış kampaniyası tapılmadı')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>#</TableHead>
            <TableHead>{t('deals.title', 'Kampaniya Adı')}</TableHead>
            <TableHead>{t('deals.duration', 'Müddət')}</TableHead>
            <TableHead>{t('deals.productsCount', 'Məhsul Sayı')}</TableHead>
            <TableHead>{t('deals.featured', 'Seçilmiş')}</TableHead>
            <TableHead>{t('deals.status', 'Status')}</TableHead>
            <TableHead className='text-right'>{t('table.actions', 'Əməliyyatlar')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((deal, index) => (
            <TableRow key={deal.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {deal.banner ? (
                    <img src={deal.banner} alt={deal.title} className='size-10 rounded object-cover' />
                  ) : (
                    <div className='size-10 rounded bg-amber-500/10 flex items-center justify-center text-amber-500'>
                      <Flame className='size-5' />
                    </div>
                  )}
                  <div>
                    <div className='font-semibold'>{deal.title}</div>
                    <div className='text-xs text-muted-foreground'>/{deal.slug}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className='text-xs'>
                <div>{deal.start_date}</div>
                <div className='text-muted-foreground'>{deal.end_date}</div>
              </TableCell>
              <TableCell>
                <Badge variant='outline'>{deal.products_count} məhsul</Badge>
              </TableCell>
              <TableCell>
                <Switch
                  checked={deal.featured}
                  onCheckedChange={(checked) => onToggleFeatured(deal.id, checked)}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={deal.status}
                  onCheckedChange={(checked) => onToggleStatus(deal.id, checked)}
                />
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:bg-destructive/10'
                  onClick={() => onDelete(deal.id)}
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
