import { Edit, Image as ImageIcon, Star, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
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
import type { ProductItem } from '../data/products.type'
import { ProductStatusSwitch } from './product-status-switch'

interface ProductsTableProps {
  products: ProductItem[]
  loading?: boolean
  onToggleStatus: (id: number, field: 'published' | 'featured' | 'todays_deal' | 'approved', value: boolean) => Promise<unknown>
  onEditStock: (product: ProductItem) => void
  onDelete: (id: number) => void
}

export function ProductsTable({
  products,
  loading,
  onToggleStatus,
  onEditStock,
  onDelete,
}: ProductsTableProps) {
  const { t } = useTranslation('products')

  if (loading) {
    return <div className='py-8 text-center text-muted-foreground'>{t('common.loading', 'Yüklənir...')}</div>
  }

  if (products.length === 0) {
    return <div className='py-8 text-center text-muted-foreground'>{t('common.noData', 'Məlumat tapılmadı')}</div>
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-14'>{t('table.thumb', 'Şəkil')}</TableHead>
            <TableHead>{t('table.nameBrand', 'Ad / Brend')}</TableHead>
            <TableHead>{t('table.categoryOwner', 'Kateqoriya / Sahibi')}</TableHead>
            <TableHead>{t('table.price', 'Qiymət')}</TableHead>
            <TableHead>{t('table.stock', 'Stok')}</TableHead>
            <TableHead>{t('table.rating', 'Reytinq')}</TableHead>
            <TableHead className='text-center'>{t('table.published', 'Dərc')}</TableHead>
            <TableHead className='text-center'>{t('table.featured', 'Seçilmiş')}</TableHead>
            <TableHead className='text-center'>{t('table.todaysDeal', 'Günün Təklifi')}</TableHead>
            <TableHead className='text-right'>{t('table.actions', 'Əməliyyatlar')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className='flex size-11 items-center justify-center overflow-hidden rounded-md border bg-muted'>
                  {p.thumbnail_img ? (
                    <img src={p.thumbnail_img} alt={p.name} className='size-full object-cover' />
                  ) : (
                    <ImageIcon className='size-5 text-muted-foreground' />
                  )}
                </div>
              </TableCell>

              <TableCell className='max-w-[260px]'>
                <p className='truncate text-sm font-semibold' title={p.name}>{p.name}</p>
                <p className='text-xs text-muted-foreground'>{p.brand_name ?? t('table.noBrand', 'Brendsiz')}</p>
              </TableCell>

              <TableCell>
                <p className='text-xs font-medium'>{p.category_name}</p>
                <Badge variant={p.added_by === 'admin' ? 'default' : 'secondary'} className='mt-1 text-[10px]'>
                  {p.seller_name ?? (p.added_by === 'admin' ? t('table.inhouse', 'In-House') : t('table.seller', 'Satıcı'))}
                </Badge>
              </TableCell>

              <TableCell>
                <p className='text-sm font-bold text-foreground'>{p.unit_price} ₼</p>
                {p.discount > 0 && (
                  <p className='text-xs text-rose-500'>
                    -{p.discount}{p.discount_type === 'percent' ? '%' : ' ₼'}
                  </p>
                )}
              </TableCell>

              <TableCell>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onEditStock(p)}
                  className='h-7 px-2 font-mono text-xs hover:bg-primary/10'
                >
                  <span className={p.current_stock <= 5 ? 'font-bold text-destructive' : ''}>
                    {p.current_stock} {p.unit}
                  </span>
                </Button>
              </TableCell>

              <TableCell>
                <div className='flex items-center gap-1 text-amber-500'>
                  <Star className='size-3.5 fill-current' />
                  <span className='text-xs font-semibold text-foreground'>{p.rating}</span>
                </div>
              </TableCell>

              <TableCell className='text-center'>
                <ProductStatusSwitch id={p.id} field='published' checked={p.published} onToggle={onToggleStatus} />
              </TableCell>

              <TableCell className='text-center'>
                <ProductStatusSwitch id={p.id} field='featured' checked={p.featured} onToggle={onToggleStatus} />
              </TableCell>

              <TableCell className='text-center'>
                <ProductStatusSwitch id={p.id} field='todays_deal' checked={p.todays_deal} onToggle={onToggleStatus} />
              </TableCell>

              <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-1'>
                  <Button variant='ghost' size='icon' className='size-8' asChild>
                    <Link to='/admin/products/create'>
                      <Edit className='size-4 text-blue-500' />
                    </Link>
                  </Button>
                  <Button variant='ghost' size='icon' className='size-8 text-destructive' onClick={() => onDelete(p.id)}>
                    <Trash2 className='size-4' />
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
