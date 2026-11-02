import { Trash2 } from 'lucide-react'
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
import { type CategoryDiscountItem } from '../data/promotions.type'

interface CategoryDiscountsTableProps {
  discounts: CategoryDiscountItem[]
  isLoading?: boolean
  onDelete: (id: number) => void
}

export function CategoryDiscountsTable({
  discounts,
  isLoading,
  onDelete,
}: CategoryDiscountsTableProps) {
  const { t } = useTranslation('promotions')
  const items = Array.isArray(discounts) ? discounts : []

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
        {t('categories.empty', 'Heç bir kateqoriya endirimi təyin edilməyib')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>#</TableHead>
            <TableHead>{t('categories.category', 'Kateqoriya Adı')}</TableHead>
            <TableHead>{t('categories.discount', 'Tətbiq Olunan Endirim')}</TableHead>
            <TableHead>{t('categories.status', 'Status')}</TableHead>
            <TableHead className='text-right'>{t('table.actions', 'Əməliyyatlar')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell className='font-semibold'>{item.category_name}</TableCell>
              <TableCell className='font-bold text-emerald-600 dark:text-emerald-400'>
                {item.discount_type === 'percent' ? `${item.discount}%` : `${item.discount.toFixed(2)} ₼`}
              </TableCell>
              <TableCell>
                <Badge variant={item.status ? 'success' : 'outline'}>
                  {item.status ? t('status.active', 'Aktiv') : t('status.inactive', 'Qeyri-aktiv')}
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:bg-destructive/10'
                  onClick={() => onDelete(item.id)}
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
