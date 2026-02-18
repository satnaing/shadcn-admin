import { useState } from 'react'
import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { DiscountType, type Promotion } from '@/types/growth'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DataTable } from '@/components/custom/data-table'
import { PageTitle } from '@/components/page-title'
import { PromotionSheet } from './components/promotion-sheet'
import { usePromotions } from './hooks/use-promotions'

export default function PromotionsPage() {
  const [open, setOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  )
  const { data: promotions = [], isLoading } = usePromotions()

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setOpen(true)
  }

  const handleCreate = () => {
    setEditingPromotion(null)
    setOpen(true)
  }

  const columns: ColumnDef<Promotion>[] = [
    {
      accessorKey: 'name',
      header: 'Campaign',
      cell: ({ row }) => (
        <div
          className='flex cursor-pointer flex-col hover:underline'
          onClick={() => handleEdit(row.original)}
        >
          <span className='font-medium'>{row.original.name.en}</span>
          {row.original.code && (
            <span className='font-mono text-xs text-muted-foreground'>
              {row.original.code}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Discount',
      cell: ({ row }) => {
        const type = row.original.type
        const value = row.original.value
        return (
          <Badge variant='outline'>
            {type === DiscountType.PERCENTAGE
              ? `${value}% OFF`
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

        // Logic: Active if within date range AND status is not explicitly inactive
        // (Adjust logic if API status field implies something else)
        const isDateActive = (!start || now >= start) && (!end || now <= end)

        // If API sends null/undefined status, assume ACTIVE if dates are valid
        // If API sends 'INACTIVE' or 'ARCHIVED', respect that.
        const apiStatus = row.original.status
        const isActive =
          isDateActive &&
          (apiStatus === 'ACTIVE' ||
            apiStatus === null ||
            apiStatus === undefined)

        return (
          <Badge className={cn(isActive ? 'bg-green-500' : 'bg-gray-400')}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
  ]

  return (
    <div className='flex flex-col gap-4 p-6 lg:gap-6 lg:p-6'>
      <PageTitle title='Promotions' onClick={handleCreate} />

      {isLoading ? (
        <div className='flex items-center justify-center py-12 text-sm text-muted-foreground'>
          Loading promotions...
        </div>
      ) : (
        <DataTable columns={columns} data={promotions} searchKey='name' />
      )}

      <PromotionSheet
        open={open}
        onOpenChange={setOpen}
        initialData={editingPromotion}
      />
    </div>
  )
}
