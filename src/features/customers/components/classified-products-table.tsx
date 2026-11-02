import { Trash2 } from 'lucide-react'
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
import { type ClassifiedProductItem } from '../data/customers.type'

interface ClassifiedProductsTableProps {
  products: ClassifiedProductItem[]
  isLoading?: boolean
  onToggleStatus: (id: number, current: boolean) => void
  onDelete: (id: number) => void
}

export function ClassifiedProductsTable({
  products,
  isLoading,
  onToggleStatus,
  onDelete,
}: ClassifiedProductsTableProps) {
  const { t } = useTranslation('customers')

  if (isLoading) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('loading', 'Yüklənir...')}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('noClassifiedProducts', 'Heç bir elan tapılmadı')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[60px]'>#</TableHead>
            <TableHead>{t('classified.name', 'Məhsul')}</TableHead>
            <TableHead>{t('classified.customer', 'Müştəri')}</TableHead>
            <TableHead>{t('classified.category', 'Kateqoriya')}</TableHead>
            <TableHead>{t('classified.condition', 'Vəziyyət')}</TableHead>
            <TableHead>{t('classified.price', 'Qiymət')}</TableHead>
            <TableHead>{t('classified.published', 'Dərc olunub')}</TableHead>
            <TableHead className='text-right'>{t('table.options', 'Əməliyyatlar')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p, index) => (
            <TableRow key={p.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {p.thumbnail && (
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      className='size-10 rounded object-cover'
                    />
                  )}
                  <span className='font-medium'>{p.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className='font-medium'>{p.customer_name}</div>
                <div className='text-xs text-muted-foreground'>{p.customer_email}</div>
              </TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>
                <Badge variant={p.condition === 'new' ? 'success' : 'outline'}>
                  {p.condition === 'new' ? t('condition.new', 'Yeni') : t('condition.used', 'İşlənmiş')}
                </Badge>
              </TableCell>
              <TableCell className='font-semibold'>{p.unit_price.toFixed(2)} ₼</TableCell>
              <TableCell>
                <Switch
                  checked={p.is_published}
                  onCheckedChange={(checked) => onToggleStatus(p.id, checked)}
                />
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:bg-destructive/10'
                  onClick={() => onDelete(p.id)}
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
