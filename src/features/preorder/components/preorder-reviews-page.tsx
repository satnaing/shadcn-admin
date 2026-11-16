import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import type { ReviewProductItem } from '../data/preorder.type'
import { useReviews } from '../hooks/use-preorder'
import { PreorderReviewDialog } from './preorder-review-dialog'
import { PreorderTabs } from './preorder-tabs'

const h = (key: string) =>
  translatedColumnHeader<ReviewProductItem, unknown>(
    `preorder:reviews.columns.${key}`
  )
const OWNERS = ['all', 'inhouse', 'seller'] as const

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Products that received reviews, with the average rating; open one to moderate its reviews. */
export function PreorderReviewsPage({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')
  const [openId, setOpenId] = useState<number | null>(null)
  const { data } = useReviews(
    toServerListParams(search, { filters: ['owner'], defaultSort: 'rating' })
  )
  const onOpen = useCallback((p: ReviewProductItem) => setOpenId(p.id), [])
  const columns = useMemo<ColumnDef<ReviewProductItem>[]>(
    () => [
      {
        accessorKey: 'product_name',
        ...h('product'),
        cell: ({ row }) => (
          <span className='font-medium'>
            {row.original.product_name}{' '}
            {row.original.has_new && (
              <Badge className='ms-1'>{t('reviews.new')}</Badge>
            )}
          </span>
        ),
      },
      { accessorKey: 'owner_name', ...h('owner') },
      {
        accessorKey: 'rating',
        ...h('rating'),
        cell: ({ row }) => (
          <span className='flex items-center gap-1'>
            <Star className='size-4 fill-amber-400 text-amber-400' />{' '}
            {row.original.rating}
          </span>
        ),
      },
      { accessorKey: 'reviews_count', ...h('reviews') },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => onOpen(row.original)}
            >
              {t('reviews.view')}
            </Button>
          </div>
        ),
      },
    ],
    [onOpen, t]
  )

  return (
    <AdminPageShell
      title={t('reviews.title')}
      description={t('reviews.description')}
    >
      <PreorderTabs
        param='owner'
        items={OWNERS}
        labelKey='products.owner'
        search={search}
        navigate={navigate}
      />
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('reviews.search')}
        noResultsMessage={t('reviews.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='rating'
      />
      <PreorderReviewDialog id={openId} onClose={() => setOpenId(null)} />
    </AdminPageShell>
  )
}
