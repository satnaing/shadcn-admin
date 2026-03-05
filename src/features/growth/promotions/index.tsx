import { useState } from 'react'
import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { DiscountType, type Promotion } from '@/types/growth'
import { Badge } from '@/components/ui/badge'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Progress } from '@/components/ui/progress'
import { DataTable } from '@/components/custom/data-table'
import { PageTitle } from '@/components/page-title'
import { PromotionQuickEditSheet } from './components/promotion-quick-edit-sheet'
import { usePromotions } from './hooks/use-promotions'

export default function PromotionsPage() {
  const [open, setOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  )
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: promotionsData, isLoading } = usePromotions({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })

  const promotions = promotionsData?.data || []
  const pageCount = promotionsData?.meta?.totalPages || 0

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setOpen(true)
  }

  const columns: ColumnDef<Promotion>[] = [
    {
      accessorKey: 'name',
      header: 'Campaign',
      cell: ({ row }) => {
        const promo = row.original
        const name = typeof promo.name === 'string' ? promo.name : promo.name.en
        return (
          <div
            className='flex cursor-pointer flex-col hover:underline'
            onClick={() => handleEdit(promo)}
          >
            <span className='font-medium'>{name}</span>
            {promo.code && (
              <span className='font-mono text-xs text-muted-foreground'>
                {promo.code}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: 'Discount',
      cell: ({ row }) => {
        const type = row.original.type
        const value = Number(row.original.value ?? 0)
        return (
          <Badge variant='outline'>
            {type === DiscountType.PERCENTAGE
              ? `${value}% OFF`
              : type === DiscountType.STAMP_PER_ITEM
                ? `${value} STAMP${value > 1 ? 'S' : ''}`
                : `$${value.toFixed(2)} OFF`}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'scope',
      header: 'Scope',
      cell: ({ row }) => (
        <Badge variant='secondary'>{row.original.scope}</Badge>
      ),
    },
    {
      accessorKey: 'timeline',
      header: 'Timeline',
      cell: ({ row }) => {
        const start = row.original.startDate
        const end = row.original.endDate
        if (!start && !end)
          return <span className='text-xs'>Always Active</span>

        return (
          <div className='flex flex-col text-[10px] leading-tight'>
            <div className='flex items-center gap-1'>
              <span className='w-8 text-muted-foreground'>From</span>
              <span>{start ? format(new Date(start), 'PP') : 'Immediate'}</span>
            </div>
            <div className='flex items-center gap-1'>
              <span className='w-8 text-muted-foreground'>To</span>
              <span>{end ? format(new Date(end), 'PP') : 'No End Date'}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      cell: ({ row }) => {
        const limit = row.original.budgetLimitAmount
        const burned = row.original.totalAmountBurned ?? 0
        if (!limit) return <span className='text-xs'>Unlimited</span>

        const percent = Math.min((burned / limit) * 100, 100)
        return (
          <div className='w-[120px] space-y-1'>
            <Progress value={percent} className='h-2' />
            <div className='flex justify-between text-[10px] text-muted-foreground'>
              <span>${burned}</span>
              <span>${limit}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const now = new Date()
        const start = row.original.startDate
          ? new Date(row.original.startDate)
          : null
        const end = row.original.endDate ? new Date(row.original.endDate) : null
        const apiStatus = row.original.status

        // Explicitly disabled by API
        if (apiStatus === 'INACTIVE' || apiStatus === 'ARCHIVED') {
          return <Badge className='bg-gray-400'>Inactive</Badge>
        }

        // Past end date → expired
        if (end && now > end) {
          return <Badge className='bg-red-500'>Expired</Badge>
        }

        // Not yet started
        if (start && now < start) {
          return <Badge className='bg-blue-500'>Scheduled</Badge>
        }

        // Within range and status is ACTIVE (or null/undefined = treated as active)
        return <Badge className='bg-green-500'>Active</Badge>
      },
    },
  ]

  if (isLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 p-6 lg:gap-6 lg:p-6'>
      <PageTitle title='Promotions' />

      <DataTable
        columns={columns}
        data={promotions}
        searchKey='name'
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={pageCount}
      />

      <PromotionQuickEditSheet
        open={open}
        onOpenChange={setOpen}
        promotion={editingPromotion}
      />
    </div>
  )
}
