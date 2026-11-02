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
import { type ClassifiedProductItem } from '../data/classified.type'

interface ClassifiedTableProps {
  products: ClassifiedProductItem[]
  isLoading?: boolean
  onToggleStatus: (id: number, current: boolean) => void
  onDelete: (id: number) => void
}

export function ClassifiedTable({
  products,
  isLoading,
  onToggleStatus,
  onDelete,
}: ClassifiedTableProps) {
  const { t } = useTranslation('classified')
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
        {t('table.empty', 'Heç bir elan məhsulu tapılmadı')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[60px]'>#</TableHead>
            <TableHead>{t('table.product', 'Məhsul')}</TableHead>
            <TableHead>{t('table.creator', 'Yaradan / Növ')}</TableHead>
            <TableHead>{t('table.category', 'Kateqoriya')}</TableHead>
            <TableHead>{t('table.condition', 'Vəziyyət')}</TableHead>
            <TableHead>{t('table.price', 'Qiymət')}</TableHead>
            <TableHead>{t('table.published', 'Dərc olunub')}</TableHead>
            <TableHead className='text-right'>{t('table.actions', 'Əməliyyatlar')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className='size-10 rounded object-cover'
                    />
                  ) : (
                    <div className='size-10 rounded bg-muted flex items-center justify-center text-xs'>
                      xS
                    </div>
                  )}
                  <div>
                    <span className='font-medium'>{item.name}</span>
                    {item.location && (
                      <div className='text-xs text-muted-foreground'>{item.location}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex flex-col gap-1'>
                  <Badge
                    variant={item.creator_type === 'admin' ? 'default' : 'secondary'}
                    className='w-fit text-[11px]'
                  >
                    {item.creator_type === 'admin'
                      ? t('types.admin', 'Admin (In-House)')
                      : t('types.seller', 'Satıcı')}
                  </Badge>
                  <span className='text-xs font-medium'>{item.creator_name}</span>
                </div>
              </TableCell>
              <TableCell className='text-sm'>{item.category}</TableCell>
              <TableCell>
                <Badge variant={item.condition === 'new' ? 'success' : 'outline'}>
                  {item.condition === 'new'
                    ? t('condition.new', 'Yeni')
                    : t('condition.used', 'İşlənmiş')}
                </Badge>
              </TableCell>
              <TableCell className='font-semibold'>{item.unit_price.toFixed(2)} ₼</TableCell>
              <TableCell>
                <Switch
                  checked={item.is_published}
                  onCheckedChange={(checked) => onToggleStatus(item.id, checked)}
                />
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
