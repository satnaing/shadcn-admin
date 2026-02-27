import { type ColumnDef } from '@tanstack/react-table'
import { type Voucher } from '@/types/growth'
import { cn } from '@/lib/utils'
import { useVouchers } from '@/hooks/queries/use-vouchers'
import { Badge } from '@/components/ui/badge'
import { BrandLoader } from '@/components/ui/brand-loader'
import { DataTable } from '@/components/custom/data-table'
import { PageTitle } from '@/components/page-title'

export default function VouchersPage() {
  const { data: vouchers, isLoading } = useVouchers()

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
      <PageTitle title='Vouchers' onClick={() => {}} />
      <DataTable
        columns={columns}
        data={vouchers || []}
        searchKey='uniqueCode'
      />
    </div>
  )
}
