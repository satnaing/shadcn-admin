import { useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Route } from '@/routes/_authenticated/growth/customers'
import { type Customer } from '@/types/growth'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCustomers } from '@/hooks/queries/use-customers'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/data-table'
import { PageTitle } from '@/components/page-title'

export default function CustomersPage() {
  const { page, limit, search } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { data: response, isLoading } = useCustomers({ page, limit, search })

  const customers = response?.data || []

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'fullName',
      header: 'Customer',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <Avatar className='h-9 w-9'>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.original.fullName}`}
              alt={row.original.fullName}
            />
            <AvatarFallback>{row.original.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.fullName}</span>
            <span className='text-xs text-muted-foreground'>
              ID: {row.original.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span
          className='cursor-pointer font-mono hover:underline'
          onClick={() => {
            navigator.clipboard.writeText(row.original.phone)
          }}
          title='Click to copy'
        >
          {row.original.phone}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            className={cn(
              status === 'ACTIVE' && 'bg-green-500 hover:bg-green-600',
              status === 'BANNED' && 'bg-red-500 hover:bg-red-600',
              status === 'PENDING' && 'bg-orange-500 hover:bg-orange-600'
            )}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return (
          <span className='text-sm text-muted-foreground'>
            {date.toLocaleDateString()}
          </span>
        )
      },
    },
    {
      id: 'actions',
      cell: () => (
        <Button variant='ghost' size='icon' title='View Details'>
          <Eye className='h-4 w-4' />
        </Button>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  const onPaginationChange = (pagination: {
    pageIndex: number
    pageSize: number
  }) => {
    navigate({
      search: (old: Record<string, unknown>) => ({
        ...old,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    })
  }

  return (
    <div className='flex flex-col gap-4 p-6 lg:gap-6 lg:p-6'>
      <PageTitle title='Customers' />
      <DataTable
        columns={columns}
        data={customers}
        searchKey='fullName'
        pageCount={response?.meta?.totalPages}
        pagination={{
          pageIndex: page - 1,
          pageSize: limit,
        }}
        onPaginationChange={onPaginationChange}
      />
    </div>
  )
}
