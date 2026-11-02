import { Star, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
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
import type { ProductReviewItem } from './data/products.type'
import { useProductReviewMutations, useProductReviews } from './hooks/useProductReviews'

export function ProductReviews() {
  const { t } = useTranslation('products')
  const { data, isLoading } = useProductReviews()
  const { toggleReviewStatus, deleteReview } = useProductReviewMutations()
  const reviews: ProductReviewItem[] = data?.data ?? []

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{t('reviews.title', 'Məhsul Rəyləri')}</h1>
          <p className='text-sm text-muted-foreground'>
            {t('reviews.subtitle', 'Müştərilərin məhsullara yazdığı rəy və reytinqlərin idarə edilməsi')}
          </p>
        </div>

        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.product', 'Məhsul')}</TableHead>
                <TableHead>{t('reviews.customer', 'Müştəri')}</TableHead>
                <TableHead>{t('table.rating', 'Reytinq')}</TableHead>
                <TableHead className='max-w-[300px]'>{t('reviews.comment', 'Rəy mətni')}</TableHead>
                <TableHead>{t('reviews.date', 'Tarix')}</TableHead>
                <TableHead className='text-center'>{t('reviews.published', 'Təsdiq')}</TableHead>
                <TableHead className='text-right'>{t('table.actions', 'Əməliyyatlar')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className='py-8 text-center text-muted-foreground'>{t('common.loading', 'Yüklənir...')}</TableCell></TableRow>
              ) : reviews.length === 0 ? (
                <TableRow><TableCell colSpan={7} className='py-8 text-center text-muted-foreground'>{t('common.noData', 'Rəy tapılmadı')}</TableCell></TableRow>
              ) : (
                reviews.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className='font-medium'>{r.product_name}</TableCell>
                    <TableCell className='text-muted-foreground'>{r.customer_name}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1 text-amber-500'>
                        <Star className='size-3.5 fill-current' />
                        <span className='text-xs font-semibold text-foreground'>{r.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-[300px] truncate text-xs text-muted-foreground' title={r.comment}>
                      {r.comment}
                    </TableCell>
                    <TableCell className='text-xs text-muted-foreground'>{r.created_at}</TableCell>
                    <TableCell className='text-center'>
                      <Switch
                        checked={r.status}
                        onCheckedChange={(val) => toggleReviewStatus({ id: r.id, status: val })}
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8 text-destructive'
                        onClick={() => deleteReview(r.id)}
                      >
                        <Trash2 className='size-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Main>
    </>
  )
}

export default ProductReviews
