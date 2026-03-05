import { useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { type Voucher } from '@/types/growth'
import { cn } from '@/lib/utils'
import { useVouchers } from '@/hooks/queries/use-vouchers'
import { Badge } from '@/components/ui/badge'
import { BrandLoader } from '@/components/ui/brand-loader'
import { DataTable } from '@/components/custom/data-table'
import { PageTitle } from '@/components/page-title'
import { VoucherSheet } from './_components/voucher-sheet'

export default function VouchersPage() {
  const [open, setOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: response, isLoading } = useVouchers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })

  const vouchers = response?.data || []

  const columns: ColumnDef<Voucher>[] = [
    {
      accessorKey: 'promotionName',
      header: 'Campaign',
      cell: ({ row }) => {
        const promotionName = row.original.promotionName
        const displayValue =
          typeof promotionName === 'object' && promotionName !== null
            ? (promotionName as Record<string, string>).en || ''
            : promotionName

        return (
          <span className='cursor-pointer text-primary hover:underline'>
            {displayValue}
          </span>
        )
      },
    },
    {
      accessorKey: 'uniqueCode',
      header: 'Voucher Code',
      cell: ({ row }) => (
        <span className='font-mono font-medium'>{row.original.uniqueCode}</span>
      ),
    },
    {
      accessorKey: 'userPhone',
      header: 'Customer',
      cell: ({ row }) => <span>{row.original.userPhone}</span>,
    },
    {
      accessorKey: 'isRedeemed',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant='secondary'
          className={cn(
            row.original.isRedeemed
              ? 'bg-red-100 text-red-800 hover:bg-red-100'
              : 'bg-green-100 text-green-800 hover:bg-green-100'
          )}
        >
          {row.original.isRedeemed ? 'Redeemed' : 'Unused'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Issued At',
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {row.original.createdAt}
        </span>
      ),
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
      <PageTitle title='Vouchers' onClick={() => setOpen(true)} />
      <DataTable
        columns={columns}
        data={vouchers}
        searchKey='uniqueCode'
        pageCount={response?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
      <VoucherSheet open={open} onOpenChange={setOpen} />
    </div>
  )
}
