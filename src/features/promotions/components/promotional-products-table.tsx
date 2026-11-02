import { Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type PromotionalProductItem } from '../data/promotions.type'

interface PromotionalProductsTableProps {
  products: PromotionalProductItem[]
  isLoading?: boolean
}

export function PromotionalProductsTable({
  products,
  isLoading,
}: PromotionalProductsTableProps) {
  const { t } = useTranslation('promotions')
  const items = Array.isArray(products) ? products : []

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
        {t('products.empty', 'Heç bir promosiya məhsulu tapılmadı')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>#</TableHead>
            <TableHead>{t('products.product', 'Məhsul')}</TableHead>
            <TableHead>{t('products.campaign', 'Aksiya / Kampaniya')}</TableHead>
            <TableHead>{t('products.source', 'Mənbə')}</TableHead>
            <TableHead>{t('products.originalPrice', 'Əsas Qiymət')}</TableHead>
            <TableHead>{t('products.dealPrice', 'Aksiya Qiyməti')}</TableHead>
            <TableHead className='text-right'>{t('products.status', 'Status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p, index) => (
            <TableRow key={p.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.name} className='size-10 rounded object-cover' />
                  ) : (
                    <div className='size-10 rounded bg-primary/10 flex items-center justify-center text-primary'>
                      <Tag className='size-5' />
                    </div>
                  )}
                  <div>
                    <div className='font-semibold'>{p.name}</div>
                    <div className='text-xs text-muted-foreground'>{p.category_name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant='outline' className='text-xs'>
                  {p.deal_title}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={p.added_by === 'admin' ? 'default' : 'secondary'} className='text-xs'>
                  {p.added_by === 'admin' ? 'In-House' : `Satıcı: ${p.seller_name ?? 'Satıcı'}`}
                </Badge>
              </TableCell>
              <TableCell className='text-muted-foreground line-through'>
                {p.original_price.toFixed(2)} ₼
              </TableCell>
              <TableCell className='font-bold text-emerald-600 dark:text-emerald-400'>
                {p.discounted_price.toFixed(2)} ₼
              </TableCell>
              <TableCell className='text-right'>
                <Badge variant={p.status ? 'success' : 'outline'}>
                  {p.status ? t('status.active', 'Aktiv') : t('status.inactive', 'Qeyri-aktiv')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
